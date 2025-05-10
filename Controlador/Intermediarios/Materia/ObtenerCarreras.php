<?php
// Indicamos que la respuesta será en formato JSON
header('Content-Type: application/json');

// Se incluyen los archivos necesarios para conexión a la base de datos y acceso al DAO de Carrera
require '../../../Modelo/BD/ConexionBD.php';    // Clase para establecer la conexión con la base de datos
require '../../../Modelo/BD/ModeloBD.php';      // Configuración de conexión (credenciales, nombre de BD, etc.)
require '../../../Modelo/DAOs/CarreraDAO.php';  // DAO que contiene las operaciones relacionadas con carreras

try {
    // Establecer la conexión a la base de datos
    $c = new ConexionBD($DatosBD);           // Se pasa la configuración para conectarse
    $conexion = $c->Conectar();              // Se obtiene el objeto de conexión PDO

    // Crear una instancia del DAO de carrera, que permite acceder a las funciones relacionadas
    $objCarreraDAO = new CarreraDAO($conexion);

    // Obtener la lista de carreras activas mediante el método del DAO
    $carreras = $objCarreraDAO->obtenerCarreras();

    // Enviar la lista como respuesta en formato JSON al cliente
    echo json_encode($carreras);

} catch (Exception $e) {
    // En caso de error, devolver código de error HTTP 500 y mensaje con el detalle del error
    http_response_code(500);  // Error interno del servidor
    echo json_encode(["mensaje" => "Error al obtener jefes de carrera: " . $e->getMessage()]);
}
