<?php
class CarreraDAO
{
    private $conector;

    /**
     * Constructor de la clase CarreraDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    //aqui va el metodo para agregar carrera
    public function AgregarCarrera($datos)
    {
        $clave = $datos->clave;
        $nombre = $datos->nombre;
        $idJefe = $datos->idJefe;

        try {
            $stmt = $this->conector->prepare("CALL spAgregarCarrera(:clave, :nombre, :idJefe, @mensaje)");
            $stmt->bindParam(':clave', $clave, PDO::PARAM_STR);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':idJefe', $idJefe, PDO::PARAM_STR);
            $stmt->execute();

            $select = $this->conector->query("select @mensaje as mensaje");
            $resultado = $select->fetch(PDO::FETCH_ASSOC);
            $mensaje = $resultado['mensaje'];

            if (strpos($mensaje, 'Exito') !== false) {
                return [
                    'estado' => 'OK',
                    'mensaje' => 'Registro guardado correctamente.'
                ];
            } else {
                return [
                    'estado' => 'ERROR',
                    'mensaje' => $mensaje
                ];
            }
        } catch (PDOException $e) {
            return [
                'estado' => 'ERROR',
                'mensaje' => 'Excepcion: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Función para verificar la clave de la carrera y si ya existe una igual 
     */
    public function existeClave($clave)
    {
        $sql = "SELECT COUNT(*) AS total FROM carrera WHERE claveCarrera = :clave";
        $stmt = $this->conector->prepare($sql);
        $stmt->bindParam(':clave', $clave);
        $stmt->execute();
        $fila = $stmt->fetch(PDO::FETCH_ASSOC);
        return $fila['total'] > 0;
    }

    /**
     * Cambia el estado de una carrera en la base de datos.
     * 
     * Esta función llama al procedimiento almacenado `spModificarEstadoCarrera`, el cual modifica 
     * el estado de una carrera si cumple con las condiciones necesarias. También maneja la respuesta 
     * del SP para informar al usuario el resultado de la operación.
     *
     * @param string $pclave  Clave única de la carrera (ID).
     * @param string $pestado Estado deseado para la carrera: debe ser 'Activo' o 'Inactivo'.
     * @return array Retorna un array asociativo con el estado ('OK' o 'Error') y un mensaje para el usuario.
     */
    public function CambiarEstadoCarrera($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validación previa: asegurar que el estado sea válido
        if ($datos->pestado !== "Activo" && $datos->pestado !== "Inactivo") {
            $resultado['mensaje'] = "El estado ingresado no es válido. Solo se permite 'Activo' o 'Inactivo'.";
            return $resultado;
        }

        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para modificar el estado de la Carrera con ID: $datos->pclave y Estado: $datos->pestado");

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spModificarEstadoCarrera(:pclave, :pestado, @mensaje)");
            $sp->bindParam(':pclave', $datos->pclave, PDO::PARAM_STR);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje devuelto por el SP
            error_log("Mensaje spModificarEstadoCarrera: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {
                case 'Error: El registro no existe':
                    $resultado['mensaje'] = "El registro que intenta modificar no existe en la base de datos.";
                    break;

                case 'Error: Estado no valido':
                    $resultado['mensaje'] = "El estado ingresado no es válido. Solo se permite 'Activo' o 'Inactivo'.";
                    break;

                case 'Estado: Sin cambios':
                    $resultado['mensaje'] = "No se realizó ningún cambio porque el estado ingresado es igual al actual.";
                    break;

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El estado del registro fue actualizado exitosamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible modificar el registro. Por favor, intente nuevamente más tarde.";
                    break;

                default:
                    // Manejo de errores desconocidos devueltos por el SP
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacte al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {
            // Registro detallado de errores para depuración en caso de excepción
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al cambiar el estado de la carrera. Por favor, intente nuevamente más tarde.";
        }

        // Devolver resultado final con estado y mensaje
        return $resultado;
    }

     /**
     * Función para mostrar todos las carreras registrados en el sistema.
     * Llama al procedimiento almacenado spMostrarCarrera.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarCarrera()
    {
        // Inicializar estado como OK por defecto
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarCarrera(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log para depuración
            error_log("Mensaje spCarrera: " . $resultado['respuestaSP']);

            // Verificar si el procedimiento fue exitoso
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;              // Asignar datos recuperados
                $resultado['filas'] = count($datos);       // Contar registros obtenidos
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de carrera para mostrar";
            }
        } catch (PDOException $e) {
            // Manejo de excepciones por errores en la base de datos
            $resultado['estado'] = "Error Mostrar carrera: " . $e->getMessage();
        }

        return $resultado;
    }

}
