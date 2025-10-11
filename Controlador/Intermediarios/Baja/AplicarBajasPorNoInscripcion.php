<?php
// --------------------------------------------------------------------------------------
// Intermediario para aplicar bajas por no inscripción.
// Llama al método DAO AplicarBajasPorNoInscripcion y devuelve el resultado al frontend.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/BajaDAO.php';

// Conexión a la base de datos y creación del DAO
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDaoBaja = new BajaDAO($pdo);

try {
    // Llamar al DAO para aplicar las bajas
    $resultado = $objDaoBaja->AplicarBajasPorNoInscripcion();

    // Preparar respuesta según el resultado del DAO
    if ($resultado['estado'] === "OK") {
        $respuesta = [
            'estado' => 'OK',
            'datos'  => $resultado['datos'] ?? [], 
            'mensaje'=> $resultado['mensaje']
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
        'mensaje' => 'Ocurrió un error al aplicar las bajas. Inténtalo de nuevo más tarde.'
    ];
    error_log("[Intermediario AplicarBajasPorNoInscripcion] Error BD: " . $e->getMessage());
}

// Enviar respuesta al cliente
echo json_encode($respuesta);
