<?php
// Archivo Intermediario que sirve para recibir los datos del cliente y usarlos con el metodo CambiarEstado de la clase JefeCarreraDAO.php

// Se incluyen los archivos necesarios para la conexión a la base de datos, la configuración, y las operaciones del jefe de carrera.
require '../../../Modelo/BD/ConexionBD.php';   // Archivo para la conexión con la base de datos.
require '../../../Modelo/BD/ModeloBD.php';     // Archivo con la configuración de la base de datos.
require '../../../Modelo/DAOs/DocenteDAO.php'; // Archivo que contiene las operaciones del jefe de carrera.
header('Content-Type: application/json');

// Decodificar los datos JSON recibidos en el cuerpo de la solicitud
$datos = json_decode(file_get_contents("php://input"));

// Mapear los campos
$datos->pid = $datos->id ?? null;
$datos->pestado = $datos->status === "Activo" ? "Activo" : "Inactivo";  // Aseguramos que el estado sea 'Activo' o 'Inactivo'

// Definir un estado inicial para la respuesta (Error)
$resultado['estado'] = "Error";

// Crear una instancia de la clase ConexionBD con los datos de configuración
$c = new ConexionBD($DatosBD);
// Conectar a la base de datos
$conexion = $c->Conectar();
// Crear una instancia de la clase JefeCarreraDAO con la conexión a la base de datos
$objDaoDocente = new DocenteDAO($conexion);

// Verificar si se recibieron datos
if ($datos) {
    try {
        // Llamar al método CambiarEstado y almacenar el resultado
        $resultado = $objDaoDocente->CambiarEstado($datos);

        // Verificar si CambiarEstado devuelve algo específico o si ocurrió un error
        if (!$resultado || $resultado['estado'] !== "OK") {
            // Si el estado no es "OK", se actualiza el estado de la respuesta
            $resultado['estado'] = "Error";
            $resultado['mensaje'] = $resultado['mensaje'] ?? "Error al cambiar el estado del docente.";
        }
    } catch (PDOException $e) {
        // Capturar cualquier error de la base de datos
        $resultado['estado'] = "Error";
        $resultado['mensaje'] = "Error al realizar la operación: " . $e->getMessage();
    }
}

// Devolver el resultado en formato JSON
echo json_encode($resultado);
?>



