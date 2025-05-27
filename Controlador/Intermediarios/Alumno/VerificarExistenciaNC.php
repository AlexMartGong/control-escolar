<?php
// Incluir archivos necesarios para conexión y acceso a datos
include_once '../../../Modelo/BD/ModeloBD.php';
include_once '../../../Modelo/BD/ConexionBD.php';
include_once '../../../Modelo/DAOs/AlumnoDAO.php';

// Establecer encabezado para indicar que la respuesta será en formato JSON
header('Content-Type: application/json');

try {
    // Obtener y decodificar el cuerpo JSON recibido
    $input = json_decode(file_get_contents('php://input'));

    // Validar que se haya proporcionado el número de control
    if (!isset($input->noControl)) {
        echo json_encode(["existe" => false, "error" => "No de control no proporcionado"]);
        exit;
    }

    // Crear instancia de conexión a la base de datos y del DAO del alumno
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();
    $objDaoAlumno = new AlumnoDAO($conexion);

    // Verificar existencia del número de control mediante el DAO
    $existe = $objDaoAlumno->ExisteNC($input->noControl);

    // Devolver resultado en formato JSON
    echo json_encode(["existe" => $existe]);

} catch (Exception $e) {
    // Manejar errores generales (conexión, ejecución, etc.)
    echo json_encode(["existe" => false, "error" => $e->getMessage()]);
}
