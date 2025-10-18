<?php
// --------------------------------------------------------------------------------------
// Intermediario para buscar periodos según el estado.
// Recibe JSON del frontend y llama al DAO para obtener los datos.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/PeriodoDAO.php';

// Obtener el estado enviado desde el cliente
$datos = json_decode(file_get_contents("php://input"));
$estadoP = $datos->estadoP ?? null;

error_log("[Intermediario BuscarPeriodoPorEstado] Estado recibido: " . ($estadoP ?? "null"));

// Conexión a la base de datos y creación del DAO
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDaoPeriodo = new PeriodoDAO($pdo);

try {
    // Llamar al DAO para obtener los alumnos
    $resultado = $objDaoPeriodo->BuscarPeriodoPorEstado($estadoP);

} catch (PDOException $e) {
    // Manejo de errores de base de datos.
    $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes." . $e->getMessage();
    error_log("Excepción PDO al buscar periodo por: " . $e->getMessage()); 
}

// Enviar resultado al cliente
echo json_encode($resultado);