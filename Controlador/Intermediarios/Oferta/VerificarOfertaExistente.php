<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

header('Content-Type: application/json');

$datos = json_decode(file_get_contents("php://input"));

$respuesta = ['existe' => false];

if ($datos) {
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $dao = new OfertaDAO($conexion);

    $existe = $dao->OfertaYaExiste($datos);
    $respuesta['existe'] = $existe;
}

echo json_encode($respuesta);
