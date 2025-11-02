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
            error_log("[CambiarEstado] Error: Valores vacíos detectados. PID o estado faltante.");
            $resultado['mensaje'] = "Ocurrió un error al procesar la solicitud. Por favor, inténtalo nuevamente.";
            return $resultado;
        }

        // Validar que el estado sea uno permitido
        if (
            $datos->pestado !== "Pendiente" &&
            $datos->pestado !== "Abierto" &&
            $datos->pestado !== "Cerrado" &&
            $datos->pestado !== "Cancelado"
        ) {
            error_log("[CambiarEstado] Error: Estado no válido recibido ({$datos->pestado}).");
            $resultado['mensaje'] = "Ocurrió un error al procesar el cambio de estado. Por favor, contacte al administrador.";
            return $resultado;
        }

        try {
            // Ejecutar el SP
            $sp = $c->prepare("CALL spModificarEstadoPeriodo(:pid, :pestado)");
            $sp->bindParam(':pid', $datos->pid, PDO::PARAM_INT);
            $sp->bindParam(':pestado', $datos->pestado, PDO::PARAM_STR);
            $sp->execute();

            // Si no lanza excepción = éxito
            $resultado['estado'] = "OK";
            $resultado['mensaje'] = "El estado del periodo fue actualizado correctamente.";
        } catch (PDOException $e) {
            $mensajeSP = $e->getMessage();

            switch (true) {
                case str_contains($mensajeSP, "Error de modificación: El registro no existe"):
                    error_log("[spModificarEstadoPeriodo] El registro no existe para el ID: {$datos->pid}");
                    $resultado['mensaje'] = "No fue posible completar la operación. El registro no está disponible.";
                    break;

                case str_contains($mensajeSP, "Error de modificación: Estado no válido"):
                    error_log("[spModificarEstadoPeriodo] Estado no válido detectado: {$datos->pestado}");
                    $resultado['mensaje'] = "Ocurrió un problema al actualizar el estado. Contacte al administrador del sistema.";
                    break;

                case str_contains($mensajeSP, "Error de modificación: No puede haber 2 periodos abiertos"):
                    $resultado['mensaje'] = "Ya existe un periodo en estado 'Abierto'. Debes cerrar el actual antes de abrir otro.";
                    break;

                case str_contains($mensajeSP, "Error de modificación: No se puede modificar un periodo cancelado"):
                    $resultado['mensaje'] = "No es posible modificar un periodo que ya fue cancelado.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al intentar actualizar el estado. Por favor, contacta al administrador.";
                    error_log("[CambiarEstado] Error desconocido: " . $mensajeSP);
                    break;
            }
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

        //Validar que los campos no vengan vacios
        if (
            empty($datos->periodo) ||
            empty($datos->fechaInicio) ||
            empty($datos->fechaTermino) ||
            empty($datos->fechaInicioAjuste) ||
            empty($datos->fechaFinalAjuste) //||
            //empty($datos->fechaCierreInscripciones)
        ) {
            $resultado['mensaje'] = "Algunos campos obligatorios están vacíos. Por favor revisa e ingrésalos antes de continuar.";
            return $resultado;
        }

        // Validar el formato del campo periodo (solo letras, números, guion medio y espacio)
        if (!preg_match('/^[A-Za-z0-9\- ]+$/', $datos->periodo)) {
            $resultado['mensaje'] = "El nombre del periodo solo puede contener letras, números, guiones y espacios. Ejemplo válido: 'Febrero 2025 - Julio 2025'.";
            return $resultado;
        }

        $hoy = strtotime(date("Y-m-d"));
        $fecha_inicio = strtotime($datos->fechaInicio);
        $fecha_fin = strtotime($datos->fechaTermino);

        // Periodo Febrero - Julio
        if (preg_match('/^Febrero \d{4} - Julio \d{4}$/', $datos->periodo)) {
            $anio = (int)substr($datos->periodo, 8, 4);

            // Rango permitido
            $inicio_min = strtotime("$anio-01-01");
            $inicio_max = strtotime("$anio-01-31");
            $fin_min = strtotime("$anio-06-01");
            $fin_max = strtotime("$anio-06-30");

            // Validar fecha de inicio
            if ($fecha_inicio < $hoy) {
                $resultado['mensaje'] = "La fecha de inicio debe ser mayor a hoy.";
                return $resultado;
            }
            if ($fecha_inicio < $inicio_min || $fecha_inicio > $inicio_max) {
                $resultado['mensaje'] = "La fecha de inicio debe estar entre el 01 y el 31 de enero del $anio.";
                return $resultado;
            }
            if ($fecha_inicio >= $fecha_fin) {
                $resultado['mensaje'] = "La fecha de inicio debe ser anterior a la fecha de término.";
                return $resultado;
            }

            // Validar fecha de término
            if ($fecha_fin < $hoy) {
                $resultado['mensaje'] = "La fecha de término debe ser mayor a hoy.";
                return $resultado;
            }
            if ($fecha_fin < $fin_min || $fecha_fin > $fin_max) {
                $resultado['mensaje'] = "La fecha de término debe estar entre el 01 y el 30 de junio del $anio.";
                return $resultado;
            }
        }

        // Periodo Agosto - Enero
        if (preg_match('/^Agosto \d{4} - Enero \d{4}$/', $datos->periodo)) {
            $anio_inicio = (int)substr($datos->periodo, 7, 4);
            $anio_fin = (int)substr($datos->periodo, 14, 4);

            $inicio_min = strtotime("$anio_inicio-08-01");
            $inicio_max = strtotime("$anio_inicio-08-31");
            $fin_min = strtotime("$anio_fin-12-01");
            $fin_max = strtotime("$anio_fin-12-31");

            // Validar fecha de inicio
            if ($fecha_inicio < $hoy) {
                $resultado['mensaje'] = "La fecha de inicio debe ser mayor a hoy.";
                return $resultado;
            }
            if ($fecha_inicio < $inicio_min || $fecha_inicio > $inicio_max) {
                $resultado['mensaje'] = "La fecha de inicio debe estar entre el 01 y el 31 de agosto del $anio.";
                return $resultado;
            }
            if ($fecha_inicio >= $fecha_fin) {
                $resultado['mensaje'] = "La fecha de inicio debe ser anterior a la fecha de término.";
                return $resultado;
            }

            // Validar fecha de término
            if ($fecha_fin < $hoy) {
                $resultado['mensaje'] = "La fecha de término debe ser mayor a hoy.";
                return $resultado;
            }
            if ($fecha_fin < $fin_min || $fecha_fin > $fin_max) {
                $resultado['mensaje'] = "La fecha de término debe estar entre el 01 y el 31 de diciembre del $anio.";
                return $resultado;
            }
        }

        $fecha_inicio_ajuste = strtotime($datos->fechaInicioAjuste);
        $fecha_final_ajuste = strtotime($datos->fechaFinalAjuste);

        // Validar fecha de inicio de ajustes
        if ($fecha_inicio_ajuste < $fecha_inicio) {
            $resultado['mensaje'] = "La fecha de inicio de ajustes no puede ser anterior a la fecha de inicio del periodo.";
            return $resultado;
        }
        if ($fecha_inicio_ajuste > strtotime("+7 days", $fecha_inicio)) {
            $resultado['mensaje'] = "La fecha de inicio de ajustes no puede ser mayor a 7 días después del inicio del periodo.";
            return $resultado;
        }

        // Validar fecha de término de ajustes
        if ($fecha_final_ajuste <= $fecha_inicio_ajuste) {
            $resultado['mensaje'] = "La fecha de término de ajustes debe ser posterior a la fecha de inicio de ajustes.";
            return $resultado;
        }
        if ($fecha_final_ajuste > strtotime("+22 days", $fecha_inicio_ajuste)) {
            $resultado['mensaje'] = "La fecha de término de ajustes no puede ser mayor a 22 días después de la fecha de inicio de ajustes.";
            return $resultado;
        }

        // Ejecución del procedimiento almacenado
        try {
            $sp = $this->conector->prepare("CALL spAgregarPeriodo(:pidPeriodo, :pperiodo, :pfechaInicio, :pfechaTermino, :pfechaInicioAjuste, :pfechaTerminoAjuste, :pfechaCierreInscripciones)");

            $sp->bindParam(':pidPeriodo', $datos->id, PDO::PARAM_INT);
            $sp->bindParam(':pperiodo', $datos->periodo, PDO::PARAM_STR);
            $sp->bindParam(':pfechaInicio', $datos->fechaInicio, PDO::PARAM_STR);
            $sp->bindParam(':pfechaTermino', $datos->fechaTermino, PDO::PARAM_STR);
            $sp->bindParam(':pfechaInicioAjuste', $datos->fechaInicioAjuste, PDO::PARAM_STR);
            $sp->bindParam(':pfechaTerminoAjuste', $datos->fechaFinalAjuste, PDO::PARAM_STR);
            $sp->bindParam(':pfechaCierreInscripciones', $datos->fechaFinalAjuste, PDO::PARAM_STR);

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
            $stmt = $c->prepare("CALL spModificarPeriodo(:id, :periodo, :fecha_inicio, :fecha_termino, :fecha_inicio_ajuste, :fecha_fin_ajuste, :pfechaCierreInscripciones)");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':periodo', $periodo, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_inicio', $fecha_inicio, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_termino', $fecha_termino, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_inicio_ajuste', $fecha_inicio_ajuste, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_fin_ajuste', $fecha_fin_ajuste, PDO::PARAM_STR);
            $stmt->bindParam(':pfechaCierreInscripciones', $fecha_fin_ajuste, PDO::PARAM_STR);
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

    function BuscarPeriodoPorEstado($pestado)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones básicas
        // -----------------------------------------
        if (empty($pestado)) {
            error_log("Error: No se recibió el valor del estado en la función.");
            $resultado['mensaje'] = "Ocurrió un problema al cargar los datos del periodo. Por favor, intenta nuevamente.";
            return $resultado;
        }

        // Validar que el estado sea un valor aceptado
        if ($pestado !== "Abierto" && $pestado !== "Cerrado" && $pestado !== "Cancelado" && $pestado !== "Pendiente") {
            error_log("Error: Estado no válido recibido ('$pestado').");
            $resultado['mensaje'] = "No se pudieron cargar los datos del periodo en este momento. Intenta nuevamente en unos instantes.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al SP para obtener los periodos
        // -----------------------------------------
        try {
            $sp = $c->prepare("CALL spBuscarPeriodoByEstado(:pestado)");
            $sp->bindParam(':pestado', $pestado, PDO::PARAM_STR);
            $sp->execute();

            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);

            // -----------------------------------------
            // Validación de resultados
            // -----------------------------------------
            if ($datos && count($datos) > 0) {
                // Si sí hay resultados
                $resultado['estado'] = "OK";
                $resultado['datos'] = $datos;
            } else {
                // Si no llegó nada
                $resultado['mensaje'] = "No se encontraron registros disponibles del periodo en este momento.";
                error_log("[BuscarPeriodoPorEstado] No se encontraron resultados para el estado '$pestado'.");
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "No se pudieron obtener los periodos en este momento. Por favor, inténtalo de nuevo más tarde.";
            error_log("[BuscarPeriodoPorEstado] Error de base de datos: " . $e->getMessage());
        }

        return $resultado;
    }
}
