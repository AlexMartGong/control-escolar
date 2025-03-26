<?php 
// Archivo Intermediario que sirve para recibir los datos del cliente y usarlos con el metodo AgregarPeriodo de OperacionesPeriodo.php

// Se incluyen los archivos necesarios para la conexión a la base de datos, la configuración, y las operaciones del periodo.
require '../../../Modelo/BD/ConexionBD.php';   // Archivo para la conexión con la base de datos.
require '../../../Modelo/BD/ModeloBD.php';     // Archivo con la configuración de la base de datos.
require '../../../Modelo/DAOs/PeriodoDAO.php'; // Archivo que contiene las operaciones del periodo.

// Decodificar los datos JSON recibidos en el cuerpo de la solicitud
$datos = json_decode(file_get_contents("php://input"));

// Definir un estado inicial para la respuesta (Error)
$resultado = ['estado' => "Error"];

// Verificar si se recibieron datos
if (isset($datos)) {
    // Crear una instancia de la clase ConexionBD con los datos de configuración
    $c = new ConexionBD($DatosBD);
    // Conectar a la base de datos
    $conexion = $c->Conectar();
    // Crear una instancia de la clase PeriodoDAO con la conexión a la base de datos
    $objDaoPeriodo = new PeriodoDAO($conexion);

    // Llamada al método AgregarPeriodo para agregar el nuevo periodo a la base de datos
    $resultado = $objDaoPeriodo->AgregarPeriodo($datos);
}

// Devolver el resultado en formato JSON
echo json_encode($resultado);
?>


