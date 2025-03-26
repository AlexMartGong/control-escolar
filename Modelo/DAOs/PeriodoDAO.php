<?php
class PeriodoDAO
{

    private $conector;

    /**
     * Constructor de la clase PeriodoDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    /**
     * Función para obtener el siguiente ID de periodo.
     * Llama al procedimiento almacenado spMostrarSiguienteIDPeriodo para obtener el siguiente ID.
     * @return int - El siguiente ID de periodo.
     * @throws PDOException - Si ocurre un error al ejecutar la consulta.
     */
    function obtenerSiguienteIDPeriodo()
    {
        $c = $this->conector;

        try {
            $sp = $c->prepare("CALL spMostrarSiguienteIDPeriodo()");
            $sp->execute();
            $resultado = $sp->fetch(PDO::FETCH_ASSOC);
            return $resultado['siguiente_id'];
        } catch (PDOException $e) {
            die("Error al llamar el spMostrarSiguienteIDPeriodo:" . $e->getMessage());
        }
    }

    /**
     * Función para mostrar los periodos existentes.
     * Llama al procedimiento almacenado spMostrarPeriodos.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    function MostrarPeriodos()
    {
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
            $sp = $c->prepare("CALL spMostrarPeriodos()");
            $sp->execute();
            $resultado['filas'] = $sp->rowCount();
            if ($resultado['filas'] > 0) {
                $resultado['datos'] = $sp->fetchAll();
            } else {
                $resultado['estado'] = "Sin resultados para mostrar";
            }
            $c = null;
        } catch (PDOException $e) {
            $resultado['estado'] = "Error: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para cambiar el estado de un periodo.
     * @param object $datos - Objeto con el id y el nuevo estado del periodo.
     * @return array - Estado de la operación y mensaje.
     */
    function CambiarEstado($datos)
    {
        $resultado['estado'] = "Error";
        $c = $this->conector;

        if (empty($datos->pid) || empty($datos->pestado)) {
            $resultado['mensaje'] = "Error: No se permiten valores vacíos.";
            return $resultado;
        }

        $estadosValidos = ['Pendiente', 'Abierto', 'Cerrado', 'Cancelado'];

        if (!in_array($datos->pestado, $estadosValidos)) {
            $resultado['mensaje'] = "Error: Estado no válido.";
            return $resultado;
        }

        try {
            $consulta = $c->prepare("SELECT estado FROM vstPeriodo WHERE clave_periodo = :pid");
            $consulta->bindParam(':pid', $datos->pid, PDO::PARAM_INT);
            $consulta->execute();
            $estadoActual = $consulta->fetchColumn();

            if ($estadoActual === false) {
                $resultado['mensaje'] = "Error: El registro no existe.";
                return $resultado;
            }

            if ($estadoActual === 'Cerrado' || $estadoActual === 'Cancelado') {
                $resultado['mensaje'] = "Error: No se puede modificar un periodo que ya está Cerrado o Cancelado.";
                return $resultado;
            }

            $sp = $c->prepare("CALL spModificarEstadoPeriodo(:pid, :pestado)");
            $sp->bindParam(':pid', $datos->pid, PDO::PARAM_INT);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();

            if ($sp->rowCount() > 0) {
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "Estado actualizado correctamente.";
            } else {
                $resultado['mensaje'] = "Error: No se realizó ninguna modificación.";
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "Error en la base de datos: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para agregar un periodo.
     * @param object $datos - Objeto con los datos del periodo a agregar.
     * @return array - Estado de la operación y mensaje.
     */
    public function AgregarPeriodo($datos)
    {
        $resultado = ['estado' => 'Error'];

        $validacionVacios = $this->validarCamposVacios($datos);
        if ($validacionVacios !== true) {
            $resultado['mensaje'] = $validacionVacios;
            return $resultado;
        }

        $validacion = $this->validarFechas($datos->fechaInicio, $datos->fechaTermino, $datos->fechaInicioAjuste, $datos->fechaFinalAjuste);
        if ($validacion !== true) {
            $resultado['mensaje'] = $validacion;
            return $resultado;
        }

        try {
            $sp = $this->conector->prepare("CALL spAgregarPeriodo(:pperiodo, :pfechaInicio, :pfechaTermino, :pfechaInicioAjuste, :pfechaTerminoAjuste)");

            $sp->bindParam(':pperiodo', $datos->periodo, PDO::PARAM_STR);
            $sp->bindParam(':pfechaInicio', $datos->fechaInicio, PDO::PARAM_STR);
            $sp->bindParam(':pfechaTermino', $datos->fechaTermino, PDO::PARAM_STR);
            $sp->bindParam(':pfechaInicioAjuste', $datos->fechaInicioAjuste, PDO::PARAM_STR);
            $sp->bindParam(':pfechaTerminoAjuste', $datos->fechaFinalAjuste, PDO::PARAM_STR);

            $sp->execute();

            if ($sp->rowCount() > 0) {
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "Periodo agregado exitosamente";
            } else {
                $resultado['mensaje'] = "No se insertó ningún registro";
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "Error en el spAgregarPeriodo: " . $e->getMessage();
        }

        return $resultado;
    }

    public function BuscarPeriodo($tipo, $valor)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        if (empty($tipo) || empty($valor)) {
            $resultado['mensaje'] = "Error: Parámetros vacíos.";
            return $resultado;
        }

        try {
            if ($tipo === 'id') {
                $stmt = $c->prepare("CALL spBuscarPeriodoByID(:valor)");
                $stmt->bindParam(':valor', $valor, PDO::PARAM_INT);
            } elseif ($tipo === 'nombre') {
                $stmt = $c->prepare("CALL spBuscarPeriodoByNombre(:valor)");
                $stmt->bindParam(':valor', $valor, PDO::PARAM_STR);
            } else {
                $resultado['mensaje'] = "Error: Tipo de búsqueda no válido.";
                return $resultado;
            }

            $stmt->execute();
            $datos = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($datos) {
                $resultado['estado'] = "OK";
                $resultado['datos'] = $datos;
            } else {
                $resultado['mensaje'] = "No se encontró el período.";
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "Error en la base de datos: " . $e->getMessage();
        }

        return $resultado;
    }

    public function ModificarPeriodo($id, $periodo, $fecha_inicio, $fecha_termino, $fecha_inicio_ajuste, $fecha_fin_ajuste)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        if (empty($id) || empty($periodo) || empty($fecha_inicio) || empty($fecha_termino) || empty($fecha_inicio_ajuste) || empty($fecha_fin_ajuste)) {
            $resultado['mensaje'] = "Error: No se permiten valores vacíos.";
            return $resultado;
        }

        try {
            $stmt = $c->prepare("CALL spModificarPeriodo(:id, :periodo, :fecha_inicio, :fecha_termino, :fecha_inicio_ajuste, :fecha_fin_ajuste)");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':periodo', $periodo, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_termino', $fecha_termino, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_inicio_ajuste', $fecha_inicio_ajuste, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_fin_ajuste', $fecha_fin_ajuste, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $resultado['estado'] = "OK";
                $resultado['mensaje'] = "Período actualizado correctamente.";
            } else {
                $resultado['mensaje'] = "No se realizaron modificaciones.";
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "Error en la base de datos: " . $e->getMessage();
        }

        return $resultado;
    }

    /**
     * Función para validar las fechas de inicio y término del periodo, así como las fechas de ajuste.
     * @param string $fechaInicio - Fecha de inicio del periodo.
     * @param string $fechaTermino - Fecha de término del periodo.
     * @param string $fechaInicioAjuste - Fecha de inicio del ajuste.
     * @param string $fechaTerminoAjuste - Fecha de término del ajuste.
     * @return mixed - Si las fechas son válidas, retorna true. Si alguna fecha no es válida, retorna un mensaje de error.
     */
    function validarFechas($fechaInicio, $fechaTermino, $fechaInicioAjuste, $fechaTerminoAjuste)
    {
        $hoy = date('Y-m-d');

        // Validar fecha de inicio (debe ser mayor a hoy y estar en agosto o enero)
        if (!$this->validarFechaSemestre($fechaInicio, $hoy, [8, 1])) {
            return "La fecha de inicio debe ser mayor a hoy y estar en agosto o enero.";
        }

        // Validar fecha de término (debe ser mayor a hoy y estar en junio o diciembre)
        if (!$this->validarFechaSemestre($fechaTermino, $hoy, [6, 12])) {
            return "La fecha de término debe ser mayor a hoy y estar en junio o diciembre.";
        }

        // Validar que la fecha de inicio de ajustes sea igual a la fecha de inicio del semestre o esté dentro de 7 días
        if (!$this->validarFechaAjustesInicio($fechaInicioAjuste, $fechaInicio, 7)) {
            return "La fecha de inicio de ajustes debe ser igual a la fecha de inicio del semestre o no mayor a 7 días.";
        }

        // Validar que la fecha de término de ajustes no sea igual a la fecha de término del semestre y esté dentro del límite de 22 días
        if ($fechaTerminoAjuste === $fechaTermino) {
            return "La fecha de término de ajustes NO puede ser igual a la fecha de término del semestre.";
        }

        if (!$this->validarFechaAjustesFin($fechaTerminoAjuste, $fechaInicioAjuste, 22)) {
            return "La fecha de término de ajustes debe ser mayor a la fecha de inicio de ajustes y no mayor a 22 días.";
        }

        return true; // Si todas las validaciones pasan
    }

    /**
     * Función para validar si la fecha es un día válido en el semestre (agosto/enero o junio/diciembre).
     * @param string $fecha - Fecha a validar.
     * @param string $hoy - Fecha actual.
     * @param array $mesesPermitidos - Array con los meses permitidos.
     * @return bool - Retorna true si la fecha es válida, de lo contrario false.
     */
    function validarFechaSemestre($fecha, $hoy, $mesesPermitidos)
    {
        if ($fecha <= $hoy) {
            return false;
        }

        $mes = (int)date('m', strtotime($fecha));
        return in_array($mes, $mesesPermitidos);
    }

    /**
     * Función para validar la fecha de inicio de ajustes (puede ser igual a la de inicio o no mayor a 7 días).
     * @param string $fechaAjuste - Fecha de ajuste a validar.
     * @param string $fechaReferencia - Fecha de referencia para el ajuste.
     * @param int $diasMax - Número máximo de días permitidos para el ajuste.
     * @return bool - Retorna true si la fecha es válida, de lo contrario false.
     */
    function validarFechaAjustesInicio($fechaAjuste, $fechaReferencia, $diasMax)
    {
        if ($fechaAjuste < $fechaReferencia) {
            return false;
        }

        $diferencia = (strtotime($fechaAjuste) - strtotime($fechaReferencia)) / (60 * 60 * 24); // Diferencia en días
        return $diferencia <= $diasMax;
    }

    /**
     * Función para validar la fecha de término de ajustes (debe ser mayor a la de inicio y no mayor a 22 días).
     * @param string $fechaAjuste - Fecha de ajuste a validar.
     * @param string $fechaReferencia - Fecha de referencia para el ajuste.
     * @param int $diasMax - Número máximo de días permitidos para el ajuste.
     * @return bool - Retorna true si la fecha es válida, de lo contrario false.
     */
    function validarFechaAjustesFin($fechaAjuste, $fechaReferencia, $diasMax)
    {
        if ($fechaAjuste <= $fechaReferencia) {
            return false;
        }

        $diferencia = (strtotime($fechaAjuste) - strtotime($fechaReferencia)) / (60 * 60 * 24); // Diferencia en días
        return $diferencia <= $diasMax;
    }

    /**
     * Función para validar que los campos no estén vacíos.
     * @param object $datos - Objeto con los datos a validar.
     * @return mixed - Retorna un mensaje de error si algún campo está vacío, o true si todos los campos están llenos.
     */
    function validarCamposVacios($datos)
    {
        $camposRequeridos = ['periodo', 'fechaInicio', 'fechaTermino', 'fechaInicioAjuste', 'fechaFinalAjuste'];

        foreach ($camposRequeridos as $campo) {
            if (empty($datos->$campo)) {
                return "El campo '$campo' no puede estar vacío.";
            }
        }
        return true; // Si todos los campos están llenos
    }
}
