<?php 
// Archivo Intermediario que sirve para recibir los datos del cliente y usarlos con el metodo AgregarJefeCarrera de la clase JefeCarreraDAO.php.php

// Se incluyen los archivos necesarios para la conexión a la base de datos, la configuración, y las operaciones del jefe de carrera.
require '../../../Modelo/BD/ConexionBD.php';   // Archivo para la conexión con la base de datos.
require '../../../Modelo/BD/ModeloBD.php';     // Archivo con la configuración de la base de datos.
require '../../../Modelo/DAOs/JefeCarreraDAO.php'; // Archivo que contiene las operaciones del jefe de carrera.

// Decodificar los datos JSON recibidos en el cuerpo de la solicitud
// Función para validar los datos del jefe
function validarDatosJefe($datos) {
    if (!isset($datos->id) || !preg_match('/^[A-Za-z0-9\-]{1,9}$/', $datos->id)) {
        return "El ID del jefe solo debe contener letras, números y guion medio (máx 9).";
    }

    if (!isset($datos->nombre) || !preg_match('/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,50}$/u', $datos->nombre)) {
        return "El nombre del jefe solo debe contener letras y espacios (máx 50).";
    }

    return true;
}

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
    $objDaoJefeCarrera = new JefeCarreraDAO($conexion);

    // Llamada al método AgregarPeriodo para agregar el nuevo periodo a la base de datos
    $resultado = $objDaoJefeCarrera->AgregarJefeCarrera($datos);
}

// Devolver el resultado en formato JSON
echo json_encode($resultado);
?>


