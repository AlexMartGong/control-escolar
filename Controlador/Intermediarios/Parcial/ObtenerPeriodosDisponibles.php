<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/ParcialDAO.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');

try {
    $c = new ConexionBD($DatosBD);
    $pdo = $c->Conectar();
    $objDao = new ParcialDAO($pdo);
    $resp = $objDao->obtenerPeriodosDisponibles();

    if (ob_get_length()) { ob_clean(); }
    echo json_encode($resp, JSON_UNESCAPED_UNICODE);
    exit;
} catch (Throwable $e) {
    if (ob_get_length()) { ob_clean(); }
    http_response_code(500);
    echo json_encode([
        'estado'  => 'Error',
        'datos'   => [],
        'mensaje' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>