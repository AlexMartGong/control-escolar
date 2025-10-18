<?php
// Intermediario para manejar solicitudes de búsqueda y modificación de bajas.
// Recibe datos desde el cliente, procesa la solicitud y delega la lógica al DAO correspondiente.

// Importar clases necesarias para conexión y manejo de la base de datos.
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/BajaDAO.php';

// Obtener los datos enviados en el cuerpo de la solicitud HTTP en formato JSON.
$datos = json_decode(file_get_contents("php://input"), true);

// Inicializar la respuesta por defecto con estado de error.
$resultado = ['estado' => 'Error'];

// Crear instancia de conexión y del DAO de parciales.
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoBaja = new BajaDAO($conexion);

try {
    if (isset($datos['Buscar']) && $datos['Buscar'] === true) {
        $resultado = $objDaoBaja->BuscarBaja($datos['pclaveBaja']);
    } 
    elseif (isset($datos['Modificar']) && $datos['Modificar'] === true) {
        $resultado = $objDaoBaja->ModificarBaja(
            $datos['pclaveBaja'],
            $datos['pfecha'],
            $datos['pmotivo'],
            $datos['pidPeriodo']
        );
    } 
    else {
       $resultado['mensaje'] = "Ocurrió un error inesperado. Contacta al administrador si el problema persiste.";
        error_log("Solicitud inválida: no se especificó 'Buscar' o 'Modificar'.");
    }
} catch (Exception $e) {
    $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes." . $e->getMessage();
    error_log("Excepción PDO al modificar baja: " . $e->getMessage()); 
}

// Devolver la respuesta al cliente en formato JSON.
echo json_encode($resultado);