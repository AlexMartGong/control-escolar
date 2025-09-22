<?php

class ParcialDAO
{

    Private $conector;

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
        while ($st->nextRowset()) {}
        $st->closeCursor();
        return (int)($row['siguiente_id'] ?? 0);
    } catch (PDOException $e) {
        error_log("SP siguiente ID parcial: ".$e->getMessage());
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

    if ($nombre==='' || $inicio==='' || $termino==='' || $idPeriodo<=0) {
        return ['estado'=>'ERROR','mensaje'=>'Faltan datos obligatorios.'];
    }
    if ($inicio > $termino) {
        return ['estado'=>'ERROR','mensaje'=>'La fecha de inicio no puede ser mayor a la de término.'];
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
        $stmt->execute(); while ($stmt->nextRowset()) {} $stmt->closeCursor();

        $row = $this->conector->query("SELECT @mensaje AS mensaje")->fetch(PDO::FETCH_ASSOC);
        $msg = $row['mensaje'] ?? '';

        if (stripos($msg, 'Exito') !== false) {
            return ['estado'=>'OK','mensaje'=>'Se ingresó correctamente el parcial.','idParcial'=>$idParcial];
        }
        return ['estado'=>'ERROR','mensaje'=>$msg ?: 'No se pudo agregar el parcial.'];

    } catch (PDOException $e) {
        return ['estado'=>'ERROR','mensaje'=>'Excepción: '.$e->getMessage()];
    }
}



    public function obtenerPeriodosDisponibles(): array {
        // 1) Llamar al SP con OUT param
        //    Usamos variable de sesión @mensaje para luego leerla.
        $this->conector->query("SET @mensaje := NULL");

        // Llama el SP: éste puede devolver filas (primer result set)
        $stmt = $this->conector->query("CALL spMostrarPeriodosDisponibles(@mensaje)");

        // 2) Si hubo filas, las leemos
        $filas = [];
        if ($stmt) {
            $filas = $stmt->fetchAll(); // puede ser [] si no hubo result set
            // Importante: consumir cualquier result set pendiente
            while ($stmt->nextRowset()) { /* vaciar */ }
            $stmt->closeCursor();
        }

        // 3) Leemos el OUT
        $rowMsg = $this->conector->query("SELECT @mensaje AS mensaje")->fetch();
        $mensajeSP = $rowMsg['mensaje'] ?? null;

        // 4) Normalizamos la respuesta para el front
        //    El SP setea 'Estado: Exito' o 'Estado: No se encontraron registros'
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

        // Si llega aquí, trátalo como error de negocio
        return [
            'estado'  => 'Error',
            'datos'   => [],
            'mensaje' => $mensajeSP ?: 'No se pudo obtener periodos'
        ];
    }

    // VALIDACIONES

    public function ObtenerRangoPeriodo(int $idPeriodo): array {
    $sql = "SELECT fecha_de_inicio AS inicio, fecha_de_termino AS fin
            FROM vstPeriodo WHERE clave_periodo = :id";
    $st = $this->conector->prepare($sql);
    $st->execute([':id' => $idPeriodo]);
    $row = $st->fetch(PDO::FETCH_ASSOC);
    if (!$row) return ['estado'=>'ERROR','mensaje'=>'Periodo no encontrado'];
    return ['estado'=>'OK','inicio'=>$row['inicio'],'fin'=>$row['fin']];
}

public function ListarParcialesPorPeriodo(int $idPeriodo): array {
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
public function ContextoParcial(int $idPeriodo): array {
    $rango = $this->ObtenerRangoPeriodo($idPeriodo);
    if (($rango['estado'] ?? '') !== 'OK') return $rango;

    $parciales = $this->ListarParcialesPorPeriodo($idPeriodo);
    $n = count($parciales);

    $iniPeriodo = $rango['inicio']; // YYYY-MM-DD
    $finPeriodo = $rango['fin'];

    // último fin (o null)
    $ultimoFin = null;
    foreach ($parciales as $p) {
        if (!$ultimoFin || $p['fechaTermino'] > $ultimoFin) $ultimoFin = $p['fechaTermino'];
    }

    // reglas base
    $inicioEditable = true;
    $terminoEditable = true;

    if ($n === 0) {
        $inicioEditable = false;             // bloqueado
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
        'periodo' => ['inicio'=>$iniPeriodo, 'fin'=>$finPeriodo],
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
        $c = $this->conector; // ← tu PDO en esta clase

        // Validaciones básicas
        $id = isset($datos->pclave) ? (int)$datos->pclave : 0;
        $estado = isset($datos->pestado) ? (string)$datos->pestado : '';
        if ($id <= 0) { $resultado['mensaje'] = 'ID inválido.'; return $resultado; }

        $permitidos = ['Abierto','Cerrado','Pendiente','Cancelado'];
        if (!in_array($estado, $permitidos, true)) {
            $resultado['mensaje'] = 'Estado no permitido.'; return $resultado;
        }

        // 1) Regla de negocio: si el periodo del parcial está Cerrado/Cancelado → forzar
        $estadoPeriodo = $this->obtenerEstadoPeriodoDeParcial($id);
        if ($estadoPeriodo && in_array($estadoPeriodo, ['Cerrado','Cancelado'], true)) {
            // Forzamos el estado del parcial al del periodo; NO permitir otro
            $upd = $c->prepare("UPDATE Parcial SET estado = :estado WHERE id_parcial = :id");
            $ok  = $upd->execute([':estado' => $estadoPeriodo, ':id' => $id]);
            if ($ok) {
                return ['estado'=>'OK','mensaje'=>"Periodo {$estadoPeriodo}. Parcial forzado a \"{$estadoPeriodo}\"."];
            }
            return ['estado'=>'Error','mensaje'=>'No fue posible forzar el estado por periodo.'];
        }

        // 2) Lógica normal: usar tu SP (compatible con cómo llamas Oferta)
        $sp = $c->prepare("CALL spModificarEstadoParcial(:pclave, :pestado, @mensaje)");
        $sp->bindParam(':pclave',  $id,     PDO::PARAM_INT);
        $sp->bindParam(':pestado', $estado, PDO::PARAM_STR);
        $sp->execute();
        while ($sp->nextRowset()) {}
        $sp->closeCursor();

        // Leer mensaje del SP
        $row = $c->query("SELECT @mensaje AS msg")->fetch(PDO::FETCH_ASSOC);
        $msg = isset($row['msg']) ? (string)$row['msg'] : '';

        // Normaliza y decide
        $ml = mb_strtolower($msg, 'UTF-8');

        // éxito tolerante: “exito/éxito/ok/actualizad…”
        if (preg_match('/(exito|éxito|ok|actualizad)/u', $ml)) {
            return ['estado'=>'OK','mensaje'=> ($msg !== '' ? $msg : 'Estado actualizado.')];
        }

        // si el SP ya te está bloqueando por periodo cerrado/cancelado
        if (preg_match('/periodo.*(cerrad|cancelad)/u', $ml)) {
            return ['estado'=>'Error','mensaje'=> ($msg !== '' ? $msg : 'El periodo está cerrado o cancelado.')];
        }

        // default: propaga mensaje del SP si vino, para depurar
        return ['estado'=>'Error','mensaje'=> ($msg !== '' ? $msg : 'No fue posible actualizar el estado.')];

    } catch (PDOException $e) {
        error_log("DAO CambiarEstadoParcial PDOException: ".$e->getMessage());
        return ['estado'=>'Error','mensaje'=>'Error de base de datos.'];
    } catch (Throwable $e) {
        error_log("DAO CambiarEstadoParcial Throwable: ".$e->getMessage());
        return ['estado'=>'Error','mensaje'=>'Error inesperado en DAO.'];
    }
}

/**
 * Regresa el estado del periodo al que pertenece el parcial (o null).
 * Ajusta nombres de tabla/campo si en tu BD difieren.
 */
private function obtenerEstadoPeriodoDeParcial(int $idParcial): ?string
{
    $sql = "SELECT per.estado
              FROM Parcial p
              JOIN Periodo per ON per.id_periodo = p.id_periodo
             WHERE p.id_parcial = :id
             LIMIT 1";
    $st = $this->conector->prepare($sql);
    $st->execute([':id' => $idParcial]);
    $estado = $st->fetchColumn();
    if ($estado === false || $estado === null) return null;

    // normaliza a mayúscula inicial
    $map = ['abierto'=>'Abierto','activo'=>'Abierto','pendiente'=>'Pendiente','cerrado'=>'Cerrado','cancelado'=>'Cancelado'];
    $k = strtolower($estado);
    return $map[$k] ?? $estado;
}



}