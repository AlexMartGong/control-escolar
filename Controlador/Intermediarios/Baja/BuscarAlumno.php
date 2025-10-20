<?php
// --------------------------------------------------------------------------------------
// Intermediario para buscar alumno por número de control.
// Llama al método DAO correspondiente y devuelve el resultado al frontend.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/AlumnoDAO.php';

// Conexión a la base de datos y creación del DAO
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDaoAlumno = new AlumnoDAO($pdo);

try {
    // Obtener número de control del POST
    $noControl = $_POST['noControl'] ?? '';

    // Validar que no esté vacío
    if (empty($noControl)) {
        $respuesta = [
            'estado' => 'Error',
            'mensaje' => 'El número de control no puede estar vacío.'
        ];
        echo json_encode($respuesta);
        exit;
    }

    // Llamar al DAO para buscar el alumno
    $resultado = $objDaoAlumno->BuscarAlumno($noControl);

    // Preparar respuesta según el resultado del DAO
    if ($resultado['estado'] === "OK") {
        $respuesta = [
            'estado' => 'OK', 
            'mensaje' => $resultado['mensaje'] ?? 'Alumno encontrado exitosamente.',
            'datos' => $resultado['datos']
        ];
    } else {
        $respuesta = [
            'estado'  => 'Error',
            'mensaje' => $resultado['mensaje'] ?? 'No se pudo encontrar el alumno.'
        ];
    }
} catch (PDOException $e) {
    // Manejo de errores de base de datos
    $respuesta = [
        'estado'  => 'Error',
        'mensaje' => 'Ocurrió un error al buscar el alumno. Inténtalo de nuevo más tarde.'
    ];
    error_log("[Intermediario BuscarAlumno] Error BD: " . $e->getMessage());
}

// Enviar respuesta al cliente
echo json_encode($respuesta);