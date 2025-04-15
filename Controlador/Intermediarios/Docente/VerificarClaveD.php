<?php
include_once '../../../Modelo/BD/ModeloBD.php';
include_once '../../../Modelo/BD/ConexionBD.php';
include_once '../../../Modelo/DAOs/DocenteDAO.php';
  

header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'));

    if (!isset($input->clave)) {
        echo json_encode(["existe" => false, "error" => "Clave no proporcionada"]);
        exit;
    }

    // Crear instancia de conexión y DAO
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $objDaoDocente = new DocenteDAO($conexion);

    $existe = $objDaoDocente->existeClave($input->clave);

    echo json_encode(["existe" => $existe]);
} catch (Exception $e) {
    echo json_encode(["existe" => false, "error" => $e->getMessage()]);
}
