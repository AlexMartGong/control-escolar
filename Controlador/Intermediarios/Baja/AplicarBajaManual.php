<?php
// --------------------------------------------------------------------------------------
// Intermediario para agregar baja manual.
// Llama al método DAO AgregarBajaManual y devuelve el resultado al frontend.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/BajaDAO.php';

// Conexión a la base de datos y creación del DAO
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDaoBaja = new BajaDAO($pdo);

try {
    // Obtener datos del POST
    $noControl = $_POST['noControl'] ?? '';
    $idPeriodo = $_POST['idPeriodo'] ?? '';
    $motivo = $_POST['motivo'] ?? '';
    $tipo = $_POST['tipo'] ?? '';

    // Llamar al DAO para agregar la baja manual
    $resultado = $objDaoBaja->AgregarBajaManual($noControl, $idPeriodo, $motivo, $tipo);

    // Preparar respuesta según el resultado del DAO
    if ($resultado['estado'] === "OK") {
        $respuesta = [
            'estado' => 'OK', 
            'mensaje' => $resultado['mensaje']
        ];
    } else {
        $respuesta = [
            'estado'  => 'Error',
            'mensaje' => $resultado['mensaje']
        ];
    }
} catch (PDOException $e) {
    // Manejo de errores de base de datos
    $respuesta = [
        'estado'  => 'Error',
        'mensaje' => 'Ocurrió un error al registrar la baja. Inténtalo de nuevo más tarde.'
    ];
    error_log("[Intermediario AgregarBajaManual] Error BD: " . $e->getMessage());
}

// Enviar respuesta al cliente
echo json_encode($respuesta);