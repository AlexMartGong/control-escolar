<?php 
// Archivo Intermediario que sirve para recibir los datos del cliente y usarlos con el metodo AgregarCarrera de la clase CarreraDAO.php.php
header('Content-Type: application/json');
// Se incluyen los archivos necesarios para la conexión a la base de datos, la configuración, y las operaciones de la carrera.
require '../../../Modelo/BD/ConexionBD.php';   // Archivo para la conexión con la base de datos.
require '../../../Modelo/BD/ModeloBD.php';     // Archivo con la configuración de la base de datos.
require '../../../Modelo/DAOs/CarreraDAO.php'; // Archivo que contiene las operaciones de la carrera.

// Decodificar los datos JSON recibidos en el cuerpo de la solicitud
$datos = json_decode(file_get_contents("php://input"));

// Definir un estado inicial para la respuesta (Error)
$resultado = ['estado' => "ERROR"];

// Verificar si se recibieron datos
if ($datos) {
    // Crear una instancia de la clase ConexionBD con los datos de configuración
    $c = new ConexionBD($DatosBD);
    // Conectar a la base de datos
    $conexion = $c->Conectar();
    // Crear una instancia de la clase CarreraDAO con la conexión a la base de datos
    $objDaoCarrera = new CarreraDAO($conexion);

    // Llamada al método AgregarCarrera para agregar la nueva carrera a la base de datos
    $resultado = $objDaoCarrera->AgregarCarrera($datos);
}

// Devolver el resultado en formato JSON
echo json_encode($resultado);
?>


