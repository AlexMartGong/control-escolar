<?php
error_reporting(0);

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

$datos = new stdClass();
$datos->idc = 0;
$datos = json_decode(file_get_contents("php://input"));

$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDao = new OfertaDAO($pdo);

error_log("Variable datos: " . $datos->idc);

$resultado = $objDao->BuscarMateriasporCarrera($datos->idc);

header('Content-Type: application/json');
echo json_encode($resultado);
?>