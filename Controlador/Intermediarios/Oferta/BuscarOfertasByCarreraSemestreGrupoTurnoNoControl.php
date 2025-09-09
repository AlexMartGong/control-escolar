<?php
// ----------------------------------------------------------------------
// Intermediario para buscar ofertas según carrera, semestre, grupo y turno.
// Este archivo recibe datos JSON desde el frontend y delega la solicitud al DAO.
// ----------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

// Obtener y decodificar los datos enviados desde el cliente (JSON)
$datos = json_decode(file_get_contents("php://input"), true);
error_log("[Intermediario BuscarOfertas] Datos recibidos: " . json_encode($datos));

// Crear la conexión con la base de datos e instanciar el DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoOferta = new OfertaDAO($conexion);

try {
    // Llamar directamente al DAO, que valida los parámetros y maneja la lógica
    $resultado = $objDaoOferta->BuscarOfertasByCarreraSemestreGrupoTurnoNoControl(
        $datos['noControl'] ?? null,
        $datos['claveCarrera'] ?? null,
        $datos['semestre'] ?? null,
        $datos['grupo'] ?? null,
        $datos['turno'] ?? null
    );

    // Registrar en log si no hubo éxito
    if ($resultado['estado'] !== "OK") {
        error_log("[Intermediario BuscarOfertas] Búsqueda sin éxito. RespuestaSP: " . ($resultado['respuestaSP'] ?? 'N/A'));
    }
} catch (PDOException $e) {
    $resultado = ['estado' => 'Error'];
    error_log("[Intermediario BuscarOfertas] Excepción PDO: " . $e->getMessage());
}

// Responder al cliente en formato JSON
echo json_encode($resultado);
