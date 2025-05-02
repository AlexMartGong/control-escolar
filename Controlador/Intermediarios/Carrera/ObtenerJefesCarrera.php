<?php
header('Content-Type: application/json');

// Se incluyen los archivos necesarios
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/JefeCarreraDAO.php';

try {
    // Conexión a la base de datos
    $c = new ConexionBD($DatosBD);
    $conexion = $c->Conectar();

    // Instancia del DAO para jefes de carrera
    $objJefeDAO = new JefeCarreraDAO($conexion);

    // Obtener la lista de jefes de carrera
    $jefes = $objJefeDAO->obtenerJefesCarrera();

    // Devolver respuesta JSON
    echo json_encode($jefes);
} catch (Exception $e) {
    // Manejo de errores
    http_response_code(500);
    echo json_encode(["mensaje" => "Error al obtener jefes de carrera: " . $e->getMessage()]);
}
