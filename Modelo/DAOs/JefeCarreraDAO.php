<?php
class JefeCarreraDAO
{
    private $conector;

    /**
     * Constructor de la clase JefeCarreraDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    /**
     * Función para agregar un jefe de carrera.
     * @param object $datos - Objeto con los datos del jefe a agregar.
     * @return array - Estado de la operación y mensaje.
     */
    public function AgregarJefeCarrera($datos)
    {
        $id = $datos->id;
        $nombre = $datos->nombre;

        try {
            $stmt = $this->conector->prepare("CALL spAgregarJefeCarrera(:id, :nombre, @mensaje)");
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->execute();

            $select = $this->conector->query("select @mensaje as mensaje");
            $resultado = $select->fetch(PDO::FETCH_ASSOC);
            $mensaje = $resultado['mensaje'];

            if (strpos($mensaje, 'Exito') !== false) {
                return [
                    'estado' => 'OK',
                    'mensaje' => 'Se ingresó correctamente el jefe de carrera.'
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
     * Función para buscar un Jefe de Carrera por ID.
     * Llama al procedimiento almacenado spBuscarJefeCarreraByID.
     * @param int $id - ID del Jefe de Carrera a buscar.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    public function BuscarJefeCarrera($id)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        if (empty($id)) {
            $resultado['mensaje'] = "Error Buscar JefeCarrera: ID vacío.";
            return $resultado;
        }

        try {
            $sp = $c->prepare("CALL spBuscarJefeCarreraByID(:pid, @mensaje)");
            $sp->bindParam(':pid', $id, PDO::PARAM_STR);
            $sp->execute();
            
            $datos = $sp->fetch(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Libera el resultado de la consulta para la siguinte

             // Ahora obtener el mensaje de salida
             $respuestaSP = $c->query("SELECT @mensaje");
             $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
             $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Manejar mensaje de salida
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['estado'] = "OK";
                $resultado['datos'] = $datos;
            } else {
                $resultado['mensaje'] = "Error Buscar JefeCarrera: No se encontró el Jefe de Carrera.";
            }

        } catch (PDOException $e) {
            $resultado['mensaje'] = "Error Buscar JefeCarrera: problemas con la base de datos; " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para modificar los datos de un Jefe de Carrera.
     * Llama al procedimiento almacenado spModificarJefeCarrera.
     * 
     * @param string $pid      ID del Jefe de Carrera con el formato AAA-1234.
     * @param string $pnombre  Nombre del Jefe de Carrera (máximo 50 caracteres, solo letras, espacios y punto).
     * 
     * @return array Retorna un array con el estado de la operación, mensaje y respuesta del procedimiento.
     */
    public function ModificarJefeCarrera($pid, $pnombre)
    {
        // Estado por defecto: error
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que los campos no estén vacíos
        if (empty($pid) || empty($pnombre)) {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: No se permiten valores vacíos.";
            return $resultado;
        }

        // Validar formato del ID: tres letras, un guión y cuatro números (ejemplo: ABC-1234)
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $pid)) {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: El formato del ID es incorrecto. Debe ser tres letras seguidas de un guion y cuatro números.";
            return $resultado;
        }

        // Validar el nombre: solo letras, espacios y puntos (.) con máximo 50 caracteres
        if (!preg_match('/^[A-Za-zÁáÉéÍíÓóÚúÑñ.\s]{1,50}$/', $pnombre)) {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: El nombre solo puede contener letras, espacios y punto (.) y debe tener un máximo de 50 caracteres.";
            return $resultado;
        }

        try {
            // Registrar en el log la ejecución del procedimiento
            error_log("Ejecutando SP para modificar Jefe de Carrera con ID: $pid y Nombre: $pnombre");

            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spModificarJefeCarrera(:pid, :pnombre, @mensaje)");
            $sp->bindParam(':pid', $pid, PDO::PARAM_STR);
            $sp->bindParam(':pnombre', $pnombre, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor(); // Liberar resultados para permitir consultar @mensaje

            // Obtener el mensaje de salida del procedimiento
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Registrar en log el mensaje de salida del SP
            error_log("Mensaje spDocente: " . $resultado['respuestaSP']);

            // Evaluar el resultado del procedimiento
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "Jefe de Carrera actualizado correctamente.";
            } else {
                $resultado['mensaje'] = "Error Modificar JefeCarrera: No se realizaron modificaciones.";
            }

        } catch (PDOException $e) {
            // Registrar error en log y devolver mensaje de error
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Error Modificar JefeCarrera: problemas en la base de datos; " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para cambiar el estado de un jefe de carrera.
     * @param object $datos - Objeto con el id y el nuevo estado del jefe de carrera.
     * @return array - Estado de la operación y mensaje.
     */
    public function CambiarEstado($datos)
    {
        $resultado['estado'] = "Error";

        if (empty($datos->pid) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Error: No se permiten valores vacíos.";
            return $resultado;
        }

        $estadosValidos = ['Activo', 'Inactivo'];

        if (!in_array($datos->pestado, $estadosValidos)) {
            $resultado['mensaje'] = "Error: Estado no válido.";
            return $resultado;
        }

        try {
            // Verificar si el registro existe
            $consulta = $this->conector->prepare("SELECT estado FROM jefecarrera WHERE idJefe = :pid");
            $consulta->bindParam(':pid', $datos->pid, PDO::PARAM_STR);
            $consulta->execute();
            $estadoActual = $consulta->fetchColumn();

            if ($estadoActual === false) {
                $resultado['mensaje'] = "Error: El registro no existe.";
                return $resultado;
            }

            // Ejecutar el procedimiento almacenado
            $sp = $this->conector->prepare("CALL spModificarEstadoJefeCarrera(:pid, :pestado, @mensaje)");
            $sp->bindParam(':pid', $datos->pid, PDO::PARAM_STR);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();

            $msgQuery = $this->conector->query("SELECT @mensaje AS mensaje");
            $mensajeData = $msgQuery->fetch(PDO::FETCH_ASSOC);
            $mensaje = $mensajeData['mensaje'] ?? 'Sin mensaje recibido';


            // Recuperar el mensaje del OUT
            $resultado['mensaje'] = $mensaje;
            $resultado['estado'] = (str_contains($mensaje, 'Exito')) ? "OK" : "Error";
    
        } catch (PDOException $e) {
            $resultado['estado'] = "Error";
            $resultado['mensaje'] = "Error en la base de datos: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para mostrar todos los Jefes de Carrera registrados.
     * Llama al procedimiento almacenado spMostrarJefeCarrera.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    function MostrarJefesCarrera()
    {
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
          
            $sp = $c->prepare("CALL spMostrarJefeCarrera(@mensaje)");
            $sp->execute();

            // Obtener los datos primero
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Libera el conjunto de resultados actual para permitir ejecutar otra consulta en la misma conexión (por ejemplo, SELECT @mensaje)

            // Ahora obtener el mensaje de salida
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            error_log("Mensaje spJefe: " . $resultado['respuestaSP']);

            // Manejar mensaje de salida
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;
                $resultado['filas'] = count($datos);
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de Jefe de Carrera para mostrar";
            }
            
        } catch (PDOException $e) {
            $resultado['estado'] = "Error Mostrar Jefes de Carrera: " . $e->getMessage();
        }

        return $resultado;
    }
}
