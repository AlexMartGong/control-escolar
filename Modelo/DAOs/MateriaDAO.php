<?php
class MateriaDAO
{
    private $conector;

    /**
     * Constructor de la clase MateriaDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    /**
     * Función para mostrar todos las Materias registradas.
     * Llama al procedimiento almacenado spMostrarMaterias.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    function MostrarMaterias()
    {
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {

            $sp = $c->prepare("CALL spMostrarMaterias(@mensaje)");
            $sp->execute();

            // Obtener los datos primero
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Libera el conjunto de resultados actual para permitir ejecutar otra consulta en la misma conexión (por ejemplo, SELECT @mensaje)

            // Ahora obtener el mensaje de salida
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            error_log("Mensaje spMateria: " . $resultado['respuestaSP']);

            // Manejar mensaje de salida
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;
                $resultado['filas'] = count($datos);
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de Materias para mostrar";
            }
        } catch (PDOException $e) {
            $resultado['estado'] = "Error Mostrar Materias: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Cambia el estado de una Materia en la base de datos.
     * 
     * Esta función llama al procedimiento almacenado `spModificarEstadoCarrera`, el cual modifica 
     * el estado de una Materia si cumple con las condiciones necesarias. También maneja la respuesta 
     * del SP para informar al usuario el resultado de la operación.
     *
     * @param string $pclave  Clave única de la Materia (ID).
     * @param string $pestado Estado deseado para la Materia: debe ser 'Activo' o 'Inactivo'.
     * @return array Retorna un array asociativo con el estado ('OK' o 'Error') y un mensaje para el usuario.
     */
    public function CambiarEstadoMaterias($datos)
    {
        // Inicializa el resultado con estado de error por defecto
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

// -----------------------------------------
// Validaciones
// -----------------------------------------

        // Validar que el estado sea un valor aceptado
        if (empty($datos->pclave) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Por favor, proporcione todos los campos requeridos: clave de la materia y estado de la materia";
            return $resultado;
        }

         // Validar formato la clave de la materia: tres letras, un guion, cuatro números (ej. ABC-1234)
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $datos->pclave)) {
            $resultado['mensaje'] = "La clave de la Materia debe tener el formato ABC-1234 (tres letras, guion y cuatro números).";
            return $resultado;
        }

        // Validar que el estado sea un valor aceptado
        if ($datos->pestado !== "Activo" && $datos->pestado !== "Inactivo") {
            $resultado['mensaje'] = "El estado ingresado no es válido. Solo se permite 'Activo' o 'Inactivo'.";
            return $resultado;
        }

// -----------------------------------------
// Llamada al sp para hacer la funcionalidad
// -----------------------------------------

        try {
            // Registrar en log el intento de ejecución del SP para trazabilidad
            error_log("Ejecutando SP para modificar el estado de la Materia con ID: $datos->pclave y Estado: $datos->pestado");

            // Preparar llamada al procedimiento almacenado con parámetros
            $sp = $c->prepare("CALL spModificarEstadoMateria(:pclave, :pestado, @mensaje)");
            $sp->bindParam(':pclave', $datos->pclave, PDO::PARAM_STR);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Cierra el cursor para liberar recursos antes de ejecutar otra consulta

            // Recuperar el mensaje generado por el procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje devuelto por el SP
            error_log("Mensaje spModificarEstadoMateria: " . $resultado['respuestaSP']);

            // Interpretar el mensaje del SP y preparar la respuesta al usuario
            switch ($resultado['respuestaSP']) {
                case 'Estado: Sin cambios':
                    $resultado['mensaje'] = "No se realizó ningún cambio porque el estado ingresado es igual al actual.";
                    break;

                case 'Estado: Exito':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El estado del registro fue actualizado exitosamente.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "No fue posible la Materia. Por favor, intente nuevamente más tarde.";
                    break;

                default:
                    // Manejo de errores desconocidos devueltos por el SP
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacte al administrador si el problema persiste.";
                    break;
            }
        } catch (PDOException $e) {
            // Registro detallado de errores para depuración en caso de excepción
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Hubo un problema al cambiar el estado de la materia. Por favor, intente nuevamente más tarde.";
        }

        // Devolver resultado final con estado y mensaje
        return $resultado;
    }
}
