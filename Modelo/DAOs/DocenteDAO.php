<?php
class DocenteDAO
{
    private $conector;

    /**
     * Constructor de la clase DocenteDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

//aqui va el metodo para agregar

    /**
     * Función para buscar un Jefe de Carrera por ID.
     * Llama al procedimiento almacenado spBuscarDocenteByID.
     * @param int $id - ID del docente a buscar.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    public function BuscarDocente($id)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        if (empty($id)) {
            $resultado['mensaje'] = "Error Modificar Docente: ID vacío.";
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
                $resultado['mensaje'] = "Error Modificar Docente: No se encontró el Docente.";
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "Error Modificar Docente: problemas con la base de datos; " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para Modificar un registro de la tabal de docentes (solo su nombre).
     * Llama al procedimiento almacenado spModificarDocente.
     * @param int $id - ID del docente que se va a modificar.
     * @param string $pnombre - Nombre que sustituira al anterior nombre del registro.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    public function ModificarDocente($pid, $pnombre)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // Validar que el ID y el nombre no estén vacíos
        if (empty($pid) || empty($pnombre)) {
            $resultado['mensaje'] = "Error Modificar Docente: No se permiten valores vacíos.";
            return $resultado;
        }

        // Validación del formato del ID: tres letras, un guión, cuatro números
        if (!preg_match('/^[A-Za-z]{3}-\d{4}$/', $pid)) {
            $resultado['mensaje'] = "Error Modificar Docente: El formato del ID es incorrecto. Debe ser tres letras seguidas de un guion y cuatro números.";
            return $resultado;
        }

        // Validar el nombre: solo letras, espacios y punto (.) con un máximo de 50 caracteres
        if (!preg_match('/^[A-Za-zÁáÉéÍíÓóÚúÑñ.\s]{1,50}$/', $pnombre)) {
            $resultado['mensaje'] = "Error Modificar Docente: El nombre solo puede contener letras, espacios y punto (.) y debe tener un máximo de 50 caracteres.";
            return $resultado;
        }

        try {
            // Log para ver el SP que se ejecutará
            error_log("Ejecutando SP para modificar Jefe de Carrera con ID: $pid y Nombre: $pnombre");

            // Ejecutando directamente el SP
            $sp = $c->prepare("CALL spModificarDocente(:pid, :pnombre)");
            $sp->bindParam(':pid', $pid, PDO::PARAM_STR);
            $sp->bindParam(':pnombre', $pnombre, PDO::PARAM_STR);
            $sp->execute();

            if ($sp->rowCount() > 0) {
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "Docente actualizado correctamente.";
            } else {
                $resultado['mensaje'] = "Error Modificar Docente: No se realizaron modificaciones.";
            }
        } catch (PDOException $e) {
            error_log("Error en la base de datos: " . $e->getMessage());
            $resultado['mensaje'] = "Error Modificar Docente: problemas en la base de datos; " . $e->getMessage();
        }

        return $resultado;
    }

//Aqui va el metodo para cambiar de estatus   

/**
* Función para mostrar todos los Docentes registrados.
* Llama al procedimiento almacenado spMostrarDocente.
* @return array - Array con el estado de la operación y los datos obtenidos.
*/
    function MostrarDocente()
    {
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            error_log("tryeando mostrar docente");
            $sp = $c->prepare("CALL spMostrarDocentes(@mensaje)");
            $sp->execute();
            $resultado['datos'] = $sp->fetchAll();
            // Obtener mensaje de salida
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['res'];

            error_log("Respuesta: $respuestaSP");

            //Tratar el mensaje de respuesta
            if($resultado['respuestaSP'] == 'Error: No hay registros'){
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de Docente para mostrar";
            }

        } catch (PDOException $e) {
            $resultado['estado'] = "Error Mostrar Docente: " . $e->getMessage();
        }

        return $resultado;
    }

    
}