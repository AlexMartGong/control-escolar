<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/agregarParcial-error.log');

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/ParcialDAO.php';

try {
    $raw = file_get_contents("php://input");
    $datos = json_decode($raw);

    if ($datos === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['estado' => 'ERROR', 'mensaje' => 'JSON inválido.']);
        exit;
    }

    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar(); // idealmente PDO

    $dao = new ParcialDAO($conexion);

    $items = is_array($datos) ? $datos : ($datos ? [$datos] : []);

    if (empty($items)) {
        echo json_encode(['estado' => 'ERROR', 'mensaje' => 'No se recibieron datos.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (count($items) === 1) {
        $res = $dao->AgregarParcial($items[0]);
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        exit;
    }

    $exitos = 0;
    $errores = [];
    foreach ($items as $i => $parcial) {
        $res = $dao->AgregarParcial($parcial);
        if (!empty($res['estado']) && strtoupper($res['estado']) === 'OK') {
            $exitos++;
        } else {
            $errores[] = "Item {$i}: " . ($res['mensaje'] ?? 'Error desconocido');
        }
    }

    if ($exitos === count($items)) {
        echo json_encode(['estado' => 'OK', 'mensaje' => "$exitos parcial(es) guardado(s) con éxito"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($exitos > 0 && count($errores) > 0) {
        echo json_encode([
            'estado'  => 'PARCIAL',
            'mensaje' => "$exitos éxito(s), " . count($errores) . " error(es)",
            'errores' => $errores
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        'estado'  => 'ERROR',
        'mensaje' => "Errores al guardar",
        'errores' => $errores
    ], JSON_UNESCAPED_UNICODE);
    exit;

} catch (Throwable $e) {
    http_response_code(500);
    if (ob_get_length()) { ob_clean(); }
    echo json_encode(['estado' => 'ERROR', 'mensaje' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}
