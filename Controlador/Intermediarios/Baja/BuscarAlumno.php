<?php
// --------------------------------------------------------------------------------------
// Intermediario para buscar alumno por número de control.
// Llama al método DAO correspondiente y devuelve el resultado al frontend.
// --------------------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/AlumnoDAO.php';

header('Content-Type: application/json');

// Conexión a la base de datos y creación del DAO
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDaoAlumno = new AlumnoDAO($pdo);

$respuesta = [
    'estado' => 'Error',
    'mensaje' => 'No se pudo procesar la solicitud.'
];

try {
    // Obtener número de control del POST
    $noControl = $_POST['noControl'] ?? '';

    // Validar que no esté vacío
    if (empty($noControl)) {
        echo json_encode([
            'estado' => 'Error',
            'mensaje' => 'El número de control no puede estar vacío.'
        ]);
        exit;
    }

    // Llamar al DAO para buscar el alumno con historial
    $resultado = $objDaoAlumno->BuscarAlumnoConHistorial($noControl);

    // Preparar respuesta según el resultado del DAO
    if ($resultado['estado'] === "OK") {
        $respuesta = [
            'estado'    => 'OK', 
            'mensaje'   => $resultado['mensaje'] ?? 'Alumno encontrado exitosamente.',
            'datos'     => $resultado['datos'] ?? [],
            'historial' => $resultado['historial'] ?? []  //  Incluimos el historial aquí
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
    error_log("[Intermediario BuscarAlumnoConHistorial] Error BD: " . $e->getMessage());
}

// Enviar respuesta al cliente
echo json_encode($respuesta);
