<?php
// Incluir archivos necesarios: modelo de base de datos, conexión y DAO de materia
include_once '../../../Modelo/BD/ModeloBD.php';
include_once '../../../Modelo/BD/ConexionBD.php';
include_once '../../../Modelo/DAOs/MateriaDAO.php';

// Indicar que la respuesta será en formato JSON
header('Content-Type: application/json');

try {
    // Obtener y decodificar los datos recibidos en formato JSON desde la solicitud POST
    $input = json_decode(file_get_contents('php://input'));

    // Validar que se haya enviado la clave
    if (!isset($input->clave)) {
        echo json_encode(["existe" => false, "error" => "Clave no proporcionada"]);
        exit; // Finalizar ejecución si no se recibió la clave
    }

    // Crear instancia de conexión a la base de datos
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();

    // Crear instancia del DAO de Materia para realizar operaciones sobre la tabla
    $objMateriaDAO = new MateriaDAO($conexion);

    // Verificar si la clave de la materia ya existe
    $existe = $objMateriaDAO->existeClaveMateria($input->clave);

    // Devolver el resultado como JSON: true si existe, false si no
    echo json_encode(["existe" => $existe]);
} catch (Exception $e) {
    // Captura de errores: enviar un mensaje JSON con el error
    echo json_encode(["existe" => false, "error" => $e->getMessage()]);
}
