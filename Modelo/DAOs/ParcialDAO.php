<?php

class ParcialDAO
{

    private $conector;

    /**
     * Constructor de la clase ParcialDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }


    /**
     * Función para obtener el siguiente ID de parcial.
     * Llama al procedimiento almacenado spMostrarSiguienteIDParcial para obtener el siguiente ID.
     * @return int - El siguiente ID de parcial.
     * @throws PDOException - Si ocurre un error al ejecutar la consulta.
     */
    public function obtenerSiguienteIDParcial(): int
    {
        try {
            $st = $this->conector->query("CALL spMostrarSiguienteIDParcial()");
            $row = $st->fetch(PDO::FETCH_ASSOC) ?: [];
            // drenar y cerrar
            while ($st->nextRowset()) {
            }
            $st->closeCursor();
            return (int)($row['siguiente_id'] ?? 0);
        } catch (PDOException $e) {
            error_log("SP siguiente ID parcial: " . $e->getMessage());
            return 0; // o lanza excepción si prefieres
        }
    }


    /**
     * Obtiene la lista de parciales registrados en la base de datos.
     *
     * @return array Retorna un arreglo asociativo con las siguientes claves:
     *               - 'datos': Lista de registros parciales devueltos por el SP (solo si hay éxito).
     *               - 'estado': "OK" si la lista fue obtenida correctamente, 
     *                            ausente o vacío en caso contrario.
     *               - 'filas': Número total de registros obtenidos (0 si no hubo resultados).
     *               - 'respuestaSP': Mensaje textual devuelto por el SP 
     */
    public function MostrarParcial()
    {

        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarParcial(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Verificar si el procedimiento fue exitoso
            switch ($resultado['respuestaSP']) {
                case 'Estado: Lista de parciales retornada exitosamente':
                    $resultado['datos'] = $datos;
                    $resultado['estado'] = "OK";
                    $resultado['filas'] = count($datos);
                    error_log("[MostrarParcial] Exito");
                    break;

                case 'Error: No hay registros':
                    $resultado['filas'] = 0;
                    error_log("[MostrarParcial] No hay registros en la bd");
                    break;

                default:
                    $resultado['filas'] = 0;
                    error_log("[MostrarParcial] SP devolvió estado inesperado: " . $resultado['respuestaSP']);
                    break;
            }
        } catch (PDOException $e) {
            error_log("[MostrarParcial] Error en BD al Mostrar Parcial: " . $e->getMessage());
        }

        return $resultado;
    }

    /**
     * Agrega un parcial vía spAgregarParcial.
     * Espera en $datos: idParcial (o id), nombre, inicio, termino, idPeriodo.
     * Devuelve: ['estado' => 'OK'|'ERROR', 'mensaje' => '...'].
     */
    public function AgregarParcial(object $datos): array
    {
        $nombre    = trim((string)($datos->nombre ?? ''));
        $inicio    = (string)($datos->inicio ?? '');
        $termino   = (string)($datos->termino ?? '');
        $idPeriodo = (int)($datos->idPeriodo ?? 0);

        if ($nombre === '' || $inicio === '' || $termino === '' || $idPeriodo <= 0) {
            return ['estado' => 'ERROR', 'mensaje' => 'Faltan datos obligatorios.'];
        }
        if ($inicio > $termino) {
            return ['estado' => 'ERROR', 'mensaje' => 'La fecha de inicio no puede ser mayor a la de término.'];
        }

        try {
            $idParcial = $this->obtenerSiguienteIDParcial();

            // 2) llamar tu SP de insert con ese id
            $this->conector->query("SET @mensaje := NULL");
            $stmt = $this->conector->prepare("
            CALL spAgregarParcial(:pidParcial,:pnombre,:pinicio,:ptermino,:pidPeriodo,@mensaje)
        ");
            $stmt->bindValue(':pidParcial', $idParcial, PDO::PARAM_INT);
            $stmt->bindValue(':pnombre',    $nombre,    PDO::PARAM_STR);
            $stmt->bindValue(':pinicio',    $inicio,    PDO::PARAM_STR);
            $stmt->bindValue(':ptermino',   $termino,   PDO::PARAM_STR);
            $stmt->bindValue(':pidPeriodo', $idPeriodo, PDO::PARAM_INT);
            $stmt->execute();
            while ($stmt->nextRowset()) {
            }
            $stmt->closeCursor();

            $row = $this->conector->query("SELECT @mensaje AS mensaje")->fetch(PDO::FETCH_ASSOC);
            $msg = $row['mensaje'] ?? '';

            if (stripos($msg, 'Exito') !== false) {
                return ['estado' => 'OK', 'mensaje' => 'Se ingresó correctamente el parcial.', 'idParcial' => $idParcial];
            }
            return ['estado' => 'ERROR', 'mensaje' => $msg ?: 'No se pudo agregar el parcial.'];
        } catch (PDOException $e) {
            return ['estado' => 'ERROR', 'mensaje' => 'Excepción: ' . $e->getMessage()];
        }
    }



    public function obtenerPeriodosDisponibles(): array
    {
        $this->conector->query("SET @mensaje := NULL");
        $stmt = $this->conector->query("CALL spMostrarPeriodosDisponibles(@mensaje)");
        $filas = [];
        if ($stmt) {
            $filas = $stmt->fetchAll();
            while ($stmt->nextRowset()) {
            }
            $stmt->closeCursor();
        }
        $rowMsg = $this->conector->query("SELECT @mensaje AS mensaje")->fetch();
        $mensajeSP = $rowMsg['mensaje'] ?? null;
        $okExito = is_string($mensajeSP) && stripos($mensajeSP, 'Exito') !== false;
        $okVacio = is_string($mensajeSP) && stripos($mensajeSP, 'No se encontraron') !== false;

        if ($okExito) {
            return [
                'estado'  => 'OK',
                'datos'   => $filas,
                'mensaje' => $mensajeSP
            ];
        }

        if ($okVacio) {
            return [
                'estado'  => 'OK',
                'datos'   => [],
                'mensaje' => $mensajeSP
            ];
        }

        return [
            'estado'  => 'Error',
            'datos'   => [],
            'mensaje' => $mensajeSP ?: 'No se pudo obtener periodos'
        ];
    }

    // VALIDACIONES

    public function ObtenerRangoPeriodo(int $idPeriodo): array
    {
        $sql = "SELECT fecha_de_inicio AS inicio, fecha_de_termino AS fin
            FROM vstPeriodo WHERE clave_periodo = :id";
        $st = $this->conector->prepare($sql);
        $st->execute([':id' => $idPeriodo]);
        $row = $st->fetch(PDO::FETCH_ASSOC);
        if (!$row) return ['estado' => 'ERROR', 'mensaje' => 'Periodo no encontrado'];
        return ['estado' => 'OK', 'inicio' => $row['inicio'], 'fin' => $row['fin']];
    }

    public function ListarParcialesPorPeriodo(int $idPeriodo): array
    {
        $sql = "SELECT idParcial, parcial AS nombre, fechaInicio, fechaTermino
            FROM Parcial WHERE idPeriodo = :id
            ORDER BY fechaInicio ASC";
        $st = $this->conector->prepare($sql);
        $st->execute([':id' => $idPeriodo]);
        return $st->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Calcula min/max y sugerencias según tus reglas.
     */
    public function ContextoParcial(int $idPeriodo): array
    {
        $rango = $this->ObtenerRangoPeriodo($idPeriodo);
        if (($rango['estado'] ?? '') !== 'OK') return $rango;

        $parciales = $this->ListarParcialesPorPeriodo($idPeriodo);
        $n = count($parciales);

        $iniPeriodo = $rango['inicio'];
        $finPeriodo = $rango['fin'];

        $ultimoFin = null;
        foreach ($parciales as $p) {
            if (!$ultimoFin || $p['fechaTermino'] > $ultimoFin) $ultimoFin = $p['fechaTermino'];
        }

        $inicioEditable = true;
        $terminoEditable = true;

        if ($n === 0) {
            $inicioEditable = false;
            $inicioSug = $iniPeriodo;
            $terminoSug = min(
                date('Y-m-d', strtotime("$inicioSug +35 days")),
                $finPeriodo
            );
            $minInicio = $iniPeriodo;
        } else {
            $minInicioPermitido = date('Y-m-d', strtotime($ultimoFin . ' +1 day'));
            $inicioSug = $minInicioPermitido;
            $terminoSug = min(
                date('Y-m-d', strtotime("$inicioSug +35 days")),
                $finPeriodo
            );
            $minInicio = $minInicioPermitido;
        }

        $maxTermino = $finPeriodo;
        $minTermino = $inicioSug;

        return [
            'estado' => 'OK',
            'periodo' => ['inicio' => $iniPeriodo, 'fin' => $finPeriodo],
            'parcialesRegistrados' => $n,
            'parciales' => $parciales,
            'reglas' => [
                'maxParciales' => 4,
                'inicioEditable' => $inicioEditable,
                'terminoEditable' => $terminoEditable,
                'minInicio' => $minInicio,
                'maxTermino' => $maxTermino,
                'minTermino' => $minTermino,
            ],
            'sugerencias' => [
                'inicio' => $inicioSug,
                'termino' => $terminoSug
            ]
        ];
    }

    public function CambiarEstadoParcial($datos)
    {
        $resultado = ['estado' => 'Error', 'mensaje' => 'Error al cambiar el estado del parcial'];

        try {
            $c = $this->conector;

            // Validaciones básicas
            $id = isset($datos->pclave) ? (int)$datos->pclave : 0;
            $estado = isset($datos->pestado) ? (string)$datos->pestado : '';
            if ($id <= 0) {
                $resultado['mensaje'] = 'ID inválido.';
                return $resultado;
            }

            $permitidos = ['Abierto', 'Cerrado', 'Pendiente', 'Cancelado'];
            if (!in_array($estado, $permitidos, true)) {
                $resultado['mensaje'] = 'Estado no permitido.';
                return $resultado;
            }

            $estadoPeriodo = $this->obtenerEstadoPeriodoDeParcial($id);
            if ($estadoPeriodo && in_array($estadoPeriodo, ['Cerrado', 'Cancelado'], true)) {
                return [
                    'estado'  => 'Error',
                    'mensaje' => "El periodo está {$estadoPeriodo}, no es posible modificar el parcial."
                ];
            }

            $sp = $c->prepare("CALL spModificarEstadoParcial(:pidParcial, :pestado, @mensaje)");
            $sp->bindParam(':pidParcial',  $id,     PDO::PARAM_INT);
            $sp->bindParam(':pestado', $estado, PDO::PARAM_STR);
            $sp->execute();
            while ($sp->nextRowset()) {
            }
            $sp->closeCursor();

            $row = $c->query("SELECT @mensaje AS msg")->fetch(PDO::FETCH_ASSOC);
            $msg = isset($row['msg']) ? (string)$row['msg'] : '';

            $ml = mb_strtolower($msg, 'UTF-8');

            if (preg_match('/(exito|éxito|ok|actualizad)/u', $ml)) {
                return ['estado' => 'OK', 'mensaje' => ($msg !== '' ? $msg : 'Estado actualizado.')];
            }

            if (preg_match('/periodo.*(cerrad|cancelad)/u', $ml)) {
                return ['estado' => 'Error', 'mensaje' => ($msg !== '' ? $msg : 'El periodo está cerrado o cancelado.')];
            }

            return ['estado' => 'Error', 'mensaje' => ($msg !== '' ? $msg : 'No fue posible actualizar el estado.')];
        } catch (PDOException $e) {
            error_log("DAO CambiarEstadoParcial PDOException: " . $e->getMessage());
            return ['estado' => 'Error', 'mensaje' => 'Error de base de datos.'];
        } catch (Throwable $e) {
            error_log("DAO CambiarEstadoParcial Throwable: " . $e->getMessage());
            return ['estado' => 'Error', 'mensaje' => 'Error inesperado en DAO.'];
        }
    }

    /**
     * Regresa el estado del periodo al que pertenece el parcial.
     * Ajusta nombres de tabla/campo si en tu BD difieren.
     */
    private function obtenerEstadoPeriodoDeParcial(int $idParcial): ?string
    {
        $sql = "SELECT per.estado
              FROM parcial p
              JOIN periodo per ON per.idPeriodo = p.idPeriodo
             WHERE p.idParcial = :id
             LIMIT 1";
        $st = $this->conector->prepare($sql);
        $st->execute([':id' => $idParcial]);
        $estado = $st->fetchColumn();
        if ($estado === false || $estado === null) return null;

        // normaliza a mayúscula inicial
        $map = ['abierto' => 'Abierto', 'activo' => 'Abierto', 'pendiente' => 'Pendiente', 'cerrado' => 'Cerrado', 'cancelado' => 'Cancelado'];
        $k = strtolower($estado);
        return $map[$k] ?? $estado;
    }

    /**
     * Busca un parcial por su ID.
     *
     * @param int $pidParcial ID del parcial a buscar.
     * @return array Retorna un array con:
     *               - 'estado': 'OK' si la operación fue exitosa, 'Error' en caso contrario.
     *               - 'mensaje': Mensaje claro para el usuario final.
     *               - 'respuestaSP': Texto devuelto por el procedimiento almacenado.
     *               - 'datos': Datos del parcial (si se encontró).
     */
    public function BuscarParcial($pidParcial)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones iniciales
        // -----------------------------------------
        if (empty($pidParcial)) {
            $resultado['mensaje'] = "No fue posible obtener la información del parcial seleccionado. Por favor, inténtalo nuevamente.";
            error_log("[BuscarParcial] El parámetro pidParcial llegó vacío.");
            return $resultado;
        }

        try {
            // -----------------------------------------
            // Ejecutar el SP una sola vez
            // -----------------------------------------
            $sp = $c->prepare("CALL spBuscarParcialByID(:pidParcial, @mensaje)");
            $sp->bindParam(':pidParcial', $pidParcial, PDO::PARAM_INT);
            $sp->execute();

            // Recuperar el parcial (si existe)
            $datos = $sp->fetch(PDO::FETCH_ASSOC);
            $sp->closeCursor();

            // Obtener el mensaje de salida
            $mensajeSP = $c->query("SELECT @mensaje")->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensajeSP['@mensaje'] ?? null;

            // -----------------------------------------
            // Validar resultados y estado del parcial
            // -----------------------------------------
            switch ($resultado['respuestaSP']) {
                case 'Estado: Exito':
                    if ($datos['estado'] === 'Cerrado' || $datos['estado'] === 'Cancelado') {
                        $resultado['mensaje'] = "El parcial seleccionado está Cerrado o Cancelado y no puede ser modificado. Por favor, selecciona otro parcial disponible.";
                    } else {
                        $resultado['estado'] = "OK";
                        $resultado['datos'] = $datos;
                    }
                    break;

                case 'Estado: No se encontro el registro':
                    $resultado['mensaje'] = "No fue posible encontrar el parcial seleccionado. Verifica la selección e intenta nuevamente.";
                    break;

                case 'Estado: No se encontraron registros':
                    $resultado['mensaje'] = "No fue posible encontrar parciales disponibles. Intenta nuevamente más tarde.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado al buscar el parcial. Inténtalo nuevamente más tarde.";
                    error_log("[BuscarParcial] Estado inesperado devuelto por SP: " . $resultado['respuestaSP']);
                    break;
            }
        } catch (PDOException $e) {
            // -----------------------------------------
            // Manejo de errores en la base de datos
            // -----------------------------------------
            error_log("[BuscarParcial] Error en BD: " . $e->getMessage());
            $resultado['mensaje'] = "No fue posible acceder a la información del parcial en este momento. Por favor, inténtalo de nuevo más tarde.";
        }

        return $resultado;
    }

    /**
     * Modifica un parcial existente en la base de datos aplicando todas las validaciones necesarias.
     *
     * Validaciones realizadas:
     *  - Que ningún parámetro obligatorio esté vacío.
     *  - Que el nombre del parcial sea válido (Primero, Segundo, Tercero o Final).
     *  - Que el parcial exista en la base de datos.
     *  - Que el parcial no esté en estado "Cerrado" ni "Cancelado".
     *  - Que el periodo no tenga ya 4 parciales registrados.
     *  - Que el periodo exista y este "Activo" o "Pendiente"
     *
     *  @param int    $pId         ID del parcial a modificar.
     *  @param string $pnombre     Nombre del parcial (valores permitidos: Primero, Segundo, Tercero, Final).
     *  @param int    $pIdPeriodo  ID del periodo académico al que pertenece el parcial.
     *  @param string $pfchInicio  Fecha de inicio del parcial (YYYY-MM-DD).
     *  @param string $pfchTermino Fecha de término del parcial (YYYY-MM-DD).
     *
     * Retorno:
     *  @return array Arreglo con:
     *               - 'estado': 'OK' si la modificación fue exitosa, 'Error' en caso contrario.
     *               - 'mensaje': Mensaje explicativo para el usuario.
     *               - 'respuestaSP': Mensaje original devuelto por el SP.
     */
    public function ModificarParcial($pId, $pnombre, $pIdPeriodo, $pfchInicio, $pfchTermino)
    {
        $resultado = ['estado' => 'Error'];
        $c = $this->conector;

        // -----------------------------------------
        // Validaciones básicas
        // -----------------------------------------

        if (empty($pId) || empty($pnombre) || empty($pIdPeriodo) || empty($pfchInicio) || empty($pfchInicio)) {
            $resultado['mensaje'] = "Por favor, completa todos los campos requeridos para poder continuar.";
            return $resultado;
        }

        // Validar que el estado sea un valor aceptado
        if ($pnombre !== "Primero" && $pnombre !== "Segundo" && $pnombre !== "Tercero" && $pnombre !== "Final") {
            $resultado['mensaje'] = "El nombre del parcial ingresado no es válido. Solo se permite 'Primero', 'Segundo', 'Tercero' o 'Final'.";
            return $resultado;
        }

        // -----------------------------------------
        // Validar parcial
        // -----------------------------------------

        $sp = $c->prepare("CALL spBuscarParcialByID(:pidParcial, @mensaje)");
        $sp->bindParam(':pidParcial', $pId, PDO::PARAM_INT);
        $sp->execute();
        $parcial = $sp->fetch(PDO::FETCH_ASSOC); // Datos del parcial (si existen)
        $sp->closeCursor();

        // Recuperar el mensaje de salida del SP
        $mensajeSP = $c->query("SELECT @mensaje");
        $mensaje = $mensajeSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'] ?? null;

        // Validar que el id de parcial existe
        if ($resultado['respuestaSP'] === 'Estado: No se encontro el registro') {
            $resultado['mensaje'] = "No existe ningún parcial con el ID proporcionado.";
            return $resultado;
        }

        // Validar que el estado del parcial sea valido
        if ($resultado['respuestaSP'] === 'Estado: Exito' && ($parcial['estado'] === 'Cerrado' || $parcial['estado'] === 'Cancelado')) {
            $resultado['mensaje'] = "El parcial que intentas modificar está Cerrado o Cancelado y no puede ser modificado. Por favor, selecciona otro parcial disponible.";
            return $resultado;
        }

        // Validar que el periodo no tenga 4 parciales registrados
        $sp = $c->prepare("CALL spValidaExcesoParcialesParaPeriodo(:pidPeriodo, @mensaje)");
        $sp->bindParam(':pidPeriodo', $pIdPeriodo, PDO::PARAM_INT);
        $sp->execute();
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        if ($mensaje['@mensaje'] === 'Estado: Exceso de parciales') {
            $resultado['mensaje'] = "El período ingresado ya tiene registrados 4 parciales. Por favor, selecciona otro período.";
            return $resultado;
        }

        // -----------------------------------------
        // Validar periodo
        // -----------------------------------------

        $sp = $c->prepare("CALL spBuscarPeriodoByID(:pid)");
        $sp->bindParam(':pid', $pIdPeriodo, PDO::PARAM_INT);
        $sp->execute();

        $periodo = $sp->fetch(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        // Validar que el periodo exista y esté en estado Abierto o Pendiente
        if (!$periodo) {
            $resultado['mensaje'] = "El periodo ingresado no existe.";
            return $resultado;
        }

        //Validar que el periodo sea Abierto o Pendiente
        if ($periodo['estado'] !== 'Abierto' && $periodo['estado'] !== 'Pendiente') {
            $resultado['mensaje'] = "El periodo debe estar en estado 'Abierto' o 'Pendiente' para realizar esta operación.";
            return $resultado;
        }

        // -----------------------------------------
        // Llamada al SP para agregar horario individual
        // -----------------------------------------

        try {
            $sp = $c->prepare("CALL spModificarParcial(:pId, :pnombre, :pIdPeriodo, :pfchInicio, :pfchTermino, @mensaje)");
            $sp->bindParam(':pId', $pId, PDO::PARAM_INT);
            $sp->bindParam(':pnombre', $pnombre, PDO::PARAM_STR);
            $sp->bindParam(':pIdPeriodo', $pIdPeriodo, PDO::PARAM_INT);
            $sp->bindParam(':pfchInicio', $pfchInicio, PDO::PARAM_STR);
            $sp->bindParam(':pfchTermino', $pfchTermino, PDO::PARAM_STR);
            $sp->execute();
            $sp->closeCursor();

            $mensajeSP = $c->query("SELECT @mensaje")->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensajeSP['@mensaje'] ?? null;

            switch ($resultado['respuestaSP']) {
                case 'Estado: Parcial modificado correctamente':
                    $resultado['estado'] = "OK";
                    $resultado['mensaje'] = "El parcial se ha modificado correctamente.";
                    break;

                case 'Error: No se encontraron coincidencias de parciales':
                    $resultado['mensaje'] = "No se encontró ningún parcial con el ID proporcionado. Verifica el ID e intenta de nuevo.";
                    break;

                case 'Estado: Sin cambios':
                    $resultado['mensaje'] = "No se realizaron cambios porque los datos ingresados son iguales a los actuales.";
                    break;

                case 'Error: El nuevo periodo ya esta registrado en 4 parciales':
                    $resultado['mensaje'] = "No es posible asignar más parciales a este período, ya cuenta con 4 registrados.";
                    break;

                case 'Error: No se pudo modificar el registro':
                    $resultado['mensaje'] = "Ocurrió un error al modificar el parcial. Por favor, intenta de nuevo más tarde.";
                    break;

                default:
                    $resultado['mensaje'] = "Ocurrió un error inesperado. Contacta al administrador si el problema persiste.";
                    error_log("[ModificarParcial] SP devolvió estado inesperado: " . $resultado['respuestaSP']);
                    break;
            }
        } catch (PDOException $e) {
            $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes.";
            error_log("[ModificarPeriodo] Error en BD al modificar periodo: " . $e->getMessage());
        }

        return $resultado;
    }
}
