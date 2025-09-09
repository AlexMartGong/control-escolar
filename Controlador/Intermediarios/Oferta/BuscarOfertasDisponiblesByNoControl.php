<?php
// --------------------------------------------------------------------------------------
// Intermediario para buscar ofertas disponibles según el número de control de un alumno.
// Este archivo recibe datos JSON desde el frontend y delega la solicitud al DAO.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

// Obtener el número de control enviado desde el cliente (JSON)
$datos = json_decode(file_get_contents("php://input"));
$noControl = $datos->noControl ?? null;

error_log("[Intermediario BuscarOfertasDisponibles] Número de control recibido: " . $noControl);

// Crear la conexión con la base de datos e instanciar el DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoOferta = new OfertaDAO($conexion);

try {
    // Llamar al DAO, que valida el parámetro y maneja la lógica
    $resultado = $objDaoOferta->BuscarOfertasDisponiblesByNoControl($noControl);

    // Registrar en log si no hubo éxito
    if ($resultado['estado'] !== "OK") {
        error_log("[Intermediario BuscarOfertasDisponibles] Búsqueda sin éxito. RespuestaSP: " . ($resultado['respuestaSP'] ?? 'N/A'));
    }
} catch (PDOException $e) {
    $resultado = ['estado' => 'Error'];
    error_log("[Intermediario BuscarOfertasDisponibles] Excepción PDO: " . $e->getMessage());
}

// Responder al cliente en formato JSON
echo json_encode($resultado);

