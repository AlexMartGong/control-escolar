<?php
// Archivo Intermediario para gestionar la búsqueda de alumnos con horarios

require '../../../Modelo/BD/ConexionBD.php';   // Conexión a la base de datos
require '../../../Modelo/BD/ModeloBD.php';    // Configuración de la BD
require '../../../Modelo/DAOs/HorarioDAO.php'; // DAO de horarios

// Recibir datos del frontend
$datos = json_decode(file_get_contents("php://input"), true);

// Log para debug
error_log("Datos recibidos en PHP: " . json_encode($datos));

// Crear instancia de conexión y DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoHorario = new HorarioDAO($conexion);

// Extraer parámetros
$carrera  = $datos['carrera'] ?? null;
$semestre = $datos['semestre'] ?? null;
$grupo    = $datos['grupo'] ?? null;
$turno    = $datos['turno'] ?? 'Matutino';

try {
    error_log("Parámetros enviados al SP: carrera=$carrera, semestre=$semestre, grupo=$grupo, turno=$turno");

    $resultado = $objDaoHorario->buscarOfertasAsignadas($carrera, $semestre, $grupo, $turno);

    echo json_encode($resultado);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

