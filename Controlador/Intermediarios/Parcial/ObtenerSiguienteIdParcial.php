<?php
// Intermediario para obtener el siguiente ID de oferta
header('Content-Type: application/json');

// Se importan los archivos necesarios
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/ParcialDAO.php';

// Crear la conexión y el DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoParcial = new ParcialDAO($conexion);

try {
    $siguiente_id = $objDaoParcial->obtenerSiguienteIDParcial();
    echo json_encode(['siguiente_id' => $siguiente_id]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}
