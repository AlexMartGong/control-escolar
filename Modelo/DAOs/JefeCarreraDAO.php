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
            $stmt = $this->conector->prepare("CALL spAgregarJefeCarrera(:id, :nombre)");
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);

            if ($stmt->execute()) {
                return ['estado' => 'OK'];
            } else {
                return [
                    'estado' => 'ERROR',
                    'mensaje' => 'No se pudo ejecutar el procedimiento.'
                ];
            }
        } catch (PDOException $e) {
            $msg = $e->getMessage();

            if (strpos($msg, 'ID del Jefe ya existe') !== false) {
                return [
                    'estado' => 'ERROR',
                    'mensaje' => 'El ID del Jefe ya existe'
                ];
            }

            return [
                'estado' => 'ERROR',
                'mensaje' => 'Excepción: ' . $msg
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
            $resultado['mensaje'] = "Error Modificar JefeCarrera: ID vacío.";
            return $resultado;
        }

        try {
            $sp = $c->prepare("CALL spBuscarJefeCarreraByID(:pid)");
            $sp->bindParam(':pid', $id, PDO::PARAM_STR);

            $sp->execute();
            $datos = $sp->fetch(PDO::FETCH_ASSOC);

            if ($datos) {
                $resultado['estado'] = "OK";
                $resultado['datos'] = $datos;
            } else {
                $resultado['mensaje'] = "Error Modificar JefeCarrera: No se encontró el Jefe de Carrera.";
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: problemas con la base de datos; " . $e->getMessage();
        }

        return $resultado;
    }

    public function ModificarJefeCarrera($pid, $pnombre)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el ID y el nombre no estén vacíos
        if (empty($pid) || empty($pnombre)) {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: No se permiten valores vacíos.";
            return $resultado;
        }

        // Validación del formato del ID: tres letras, un guión, cuatro números
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $pid)) {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: El formato del ID es incorrecto. Debe ser tres letras seguidas de un guion y cuatro números.";
            return $resultado;
        }

        // Validar el nombre: solo letras, espacios y punto (.) con un máximo de 50 caracteres
        if (!preg_match('/^[A-Za-zÁáÉéÍíÓóÚúÑñ.\s]{1,50}$/', $pnombre)) {
            $resultado['mensaje'] = "Error Modificar JefeCarrera: El nombre solo puede contener letras, espacios y punto (.) y debe tener un máximo de 50 caracteres.";
            return $resultado;
        }

        try {
            // Log para ver el SP que se ejecutará
            error_log("Ejecutando SP para modificar Jefe de Carrera con ID: $pid y Nombre: $pnombre");

            // Ejecutando directamente el SP
            $sp = $c->prepare("CALL spModificarJefeCarrera(:pid, :pnombre)");
            $sp->bindParam(':pid', $pid, PDO::PARAM_STR);
            $sp->bindParam(':pnombre', $pnombre, PDO::PARAM_STR);
            $sp->execute();

            if ($sp->rowCount() > 0) {
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "Jefe de Carrera actualizado correctamente.";
            } else {
                $resultado['mensaje'] = "Error Modificar JefeCarrera: No se realizaron modificaciones.";
            }
        } catch (PDOException $e) {
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
            $sp = $this->conector->prepare("CALL spModificarEstadoJefeCarrera(?, ?)");
            $sp->execute([$datos->pid, $datos->pestado]);

            // Si no lanzó excepción, se considera éxito
            $resultado['estado'] = "OK";
            $resultado['mensaje'] = "Estado actualizado correctamente.";
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
            $sp = $c->prepare("CALL spMostrarJefeCarrera()");
            $sp->execute();
            $resultado['filas'] = $sp->rowCount();

            if ($resultado['filas'] > 0) {
                $resultado['datos'] = $sp->fetchAll();
            } else {
                $resultado['estado'] = "Sin registros de jefes de carrera para mostrar";
            }
        } catch (PDOException $e) {
            $resultado['estado'] = "Error Mostrar Jefes de Carrera: " . $e->getMessage();
        }

        return $resultado;
    }

    

    
}
