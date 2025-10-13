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

    // Preparar respuesta según el resultado
    if ($resultado['estado'] === "OK") {
        $respuesta = [
            'estado' => 'OK',
            'datos' => $resultado['datos']
        ];
    } else {
        $respuesta = [
            'estado' => 'Error',
            'mensaje' => $resultado['mensaje']
        ];
    }
} catch (PDOException $e) {
    // Manejo de errores de base de datos
    $respuesta = ['estado' => 'Error', 'mensaje' => $resultado['mensaje']];
    error_log("[Intermediario BuscarPeriodoPorEstado] Error BD: " . $e->getMessage());
}

// Enviar respuesta al cliente
echo json_encode($respuesta);