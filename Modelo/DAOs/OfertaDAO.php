<?php
class OfertaDAO
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

    /**
     * Función para mostrar todos las ofertas registradas en el sistema.
     * Llama al procedimiento almacenado spMostrarOferta.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarOferta()
    {
        // Inicializar estado como OK por defecto
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarOferta(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log para depuración
            error_log("Mensaje spOferta: " . $resultado['respuestaSP']);

            // Verificar si el procedimiento fue exitoso
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;              // Asignar datos recuperados
                $resultado['filas'] = count($datos);       // Contar registros obtenidos
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de oferta para mostrar";
            }
        } catch (PDOException $e) {
            // Manejo de excepciones por errores en la base de datos
            $resultado['estado'] = "Error Mostrar oferta: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Cambia el estado de una oferta en la base de datos.
     * 
     * Este método realiza múltiples validaciones de los datos de entrada
     * y luego llama al procedimiento almacenado `spModificarEstadoOferta`, que 
     * se encarga de modificar el estado de la oferta si cumple con las condiciones.
     * 
     * También interpreta el mensaje de salida del SP y proporciona una
     * respuesta clara para el usuario final.
     *
     * @param object $datos Objeto con las propiedades:
     *                      - pclave: ID entero de la oferta a modificar.
     *                      - pestado: Estado nuevo a asignar ("Asignada" o "No asignada").
     * @return array Retorna un array asociativo con el estado ('OK' o 'Error') 
     *               y un mensaje explicativo.
     */
    public function CambiarEstadoOfertas($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones
        // -----------------------------------------

        // Validar que el estado sea un valor aceptado
        if (empty($datos->pclave) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Por favor, proporcione todos los campos requeridos: clave de la oferta y estado de la oferta";
            return $resultado;
        }

        // Validar que el idOferta sea un número entero positivo
        if (!filter_var($datos->pclave, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
            $resultado['mensaje'] = "El ID de la oferta debe ser un número entero positivo.";
            return $resultado;
        }

        // Validar que el estado sea un valor aceptado
        if ($datos->pestado !== "Asignada" && $datos->pestado !== "No asignada") {
            $resultado['mensaje'] = "El estado ingresado no es válido. Solo se permite 'Asignada' o 'No asignada'.";
            return $resultado;
        }

        // Validacion doble
        $sp = $c->prepare("CALL spBuscarOfertaByID(:pid, @mensaje)");
        $sp->bindParam(':pid', $datos->pclave, PDO::PARAM_INT);
        $sp->execute();

        // Obtener la fila del resultado
        $oferta = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        // Obtener el mensaje del SP
        $respuestaSPV = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSPV->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        // Verificar si el estado ingresado es igual al actual
        if ($mensaje['@mensaje'] === 'Estado: Exito' && $oferta['estado'] === $datos->pestado) {
            $resultado['mensaje'] = "No se realizó ningún cambio porque el estado ingresado es igual al actual.";
            return $resultado;
        }

        // Verificar si ya existe una oferta con la misma clave (por ejemplo, al insertar)
        if ($mensaje['@mensaje'] === 'Error: No existen registros con el parámetro solicitado') {
            $resultado['mensaje'] = "El registro de oferta que se esta intentando modificar no existe, por favor intente con otro.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al sp para hacer la funcionalidad
        // -----------------------------------------

        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para modificar el estado de la Materia con ID: $datos->pclave y Estado: $datos->pestado");

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spModificarEstadoOferta(:pclave, :pestado, @mensaje)");
            $sp->bindParam(':pclave', $datos->pclave, PDO::PARAM_INT);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje devuelto por el SP
            error_log("Mensaje spModificarEstadoOferta: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El estado del registro fue actualizado exitosamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible el cambio de estado de la Oferta. Por favor, intente nuevamente más tarde.";
                    break;

                default:
                    // Manejo de errores desconocidos devueltos por el SP
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacte al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {
            // Registro detallado de errores para depuración en caso de excepción
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al cambiar el estado de la Oferta. Por favor, intente nuevamente más tarde.";
        }

        // Devolver resultado final con estado y mensaje
        return $resultado;
    }
}
