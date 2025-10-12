<?php
// --------------------------------------------------------------------------------------
// Intermediario para buscar alumnos según el estado.
// Recibe JSON del frontend y llama al DAO para obtener los datos.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/AlumnoDAO.php';

// Obtener el estado enviado desde el cliente
$datos = json_decode(file_get_contents("php://input"));
$estado = $datos->estado ?? null;

error_log("[Intermediario BuscarAlumnosPorEstado] Estado recibido: " . ($estado ?? "null"));

// Conexión a la base de datos y creación del DAO
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDaoAlumno = new AlumnoDAO($pdo);

try {
    // Llamar al DAO para obtener los alumnos
    $resultado = $objDaoAlumno->BuscarAlumnosPorEstado($estado);

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
    $respuesta = ['estado' => 'Error', 'mensaje' => 'No se pudieron obtener los alumnos.'];
    error_log("[Intermediario BuscarAlumnosPorEstado] Error BD: " . $e->getMessage());
}

// Enviar respuesta al cliente
echo json_encode($respuesta);