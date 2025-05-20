<?php
require '../../../Modelo/BD/ConexionBD.php';   
require '../../../Modelo/BD/ModeloBD.php';  
require '../../../Modelo/DAOs/OfertaDAO.php';

header('Content-Type: application/json');

$pclaveCarrera = $_POST['claveCarrera'] ?? null;

if ($pclaveCarrera) {
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $objOfDAO = new OfertaDAO($conexion);
    $materias = $objOfDAO->BuscarMateriasporCarrera($pclaveCarrera);

    echo json_encode($materias);
} else {
    echo json_encode(['estado' => 'Error', 'mensaje' => 'Clave de carrera no proporcionada.']);
}
