<?php
// --------------------------------------------------------------------------------------
// Intermediario para obtener las bajas realizadas durante el periodo vigente.
// Recibe JSON del frontend y llama al DAO para obtener los datos.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/BajaDAO.php';

// Obtener el estado enviado desde el cliente
$datos = json_decode(file_get_contents("php://input"));

// Conexión a la base de datos y creación del DAO
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDaoBaja = new BajaDAO($pdo);

try {

    // Llamar al DAO para obtener los alumnos
    $resultado = $objDaoBaja->MostrarBajasRealizadas();

} catch (PDOException $e) {
    // Manejo de errores de base de datos
    $resultado = ['estado' => 'Error', 'mensaje' => 'No se pudieron obtener las bajas realizadas.'];
    error_log("[Intermediario MostrarBajasRealizadas] Error BD: " . $e->getMessage());
}

// Enviar respuesta al cliente
echo json_encode($resultado);
