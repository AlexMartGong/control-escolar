<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

header('Content-Type: application/json');

// Leer el cuerpo del POST (JSON)
$entrada = json_decode(file_get_contents("php://input"), true);

// Debug: mostrar lo que se recibió
error_log("Entrada recibida en ObtenerMateriasPorCarrera.php: " . print_r($entrada, true));

if (!isset($entrada['claveCarrera'])) {
    $error = ['estado' => 'Error', 'mensaje' => 'Carrera no proporcionada'];
    error_log("Error: carrera no proporcionada");
    echo json_encode($error);
    exit;
}

$claveCarrera = $entrada['claveCarrera'];
error_log("Clave carrera recibida: " . $claveCarrera);

$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDao = new OfertaDAO($pdo);

$resultado = $objDao->BuscarMateriasporCarrera($claveCarrera);

// Debug: mostrar resultado antes de enviar
error_log("Resultado del DAO BuscarMateriasporCarrera: " . print_r($resultado, true));

echo json_encode($resultado);
