<?php
// Archivo Intermediario para gestionar la búsqueda de ofertas asignadas

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/HorarioDAO.php';

// Recibir datos del frontend
$input = file_get_contents("php://input");

$datos = json_decode($input, true);


$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoHorario = new HorarioDAO($conexion);

$carrera  = $datos['claveCarrera'] ?? null;
$semestre = $datos['semestre'] ?? null;
$grupo    = $datos['grupo'] ?? null;
$turno    = $datos['turno'] ?? 'Matutino';


try {
    $resultado = $objDaoHorario->buscarOfertasAsignadas($carrera, $semestre, $grupo, $turno);

    echo json_encode($resultado);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>