<?php
// Intermediario para manejar solicitudes de búsqueda y modificación de parciales.
// Recibe datos desde el cliente, procesa la solicitud y delega la lógica al DAO correspondiente.

// Importar clases necesarias para conexión y manejo de la base de datos.
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/ParcialDAO.php';

// Obtener los datos enviados en el cuerpo de la solicitud HTTP en formato JSON.
$datos = json_decode(file_get_contents("php://input"), true);

// Inicializar la respuesta por defecto con estado de error.
$resultado = ['estado' => 'Error'];

// Crear instancia de conexión y del DAO de parciales.
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoParcial = new ParcialDAO($conexion);

try {
    // -----------------------------------------
    // CASO 1: Buscar parcial por ID
    // -----------------------------------------
    if (isset($datos['Buscar']) && $datos['Buscar'] === true) {
        // Llamar al método del DAO para obtener los datos del parcial.
        $resultado = $objDaoParcial->BuscarParcial($datos['pId']);

    // -----------------------------------------
    // CASO 2: Modificar parcial existente
    // -----------------------------------------
    } elseif (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {
        // Llamar al método del DAO para actualizar el parcial con los datos recibidos.
        $resultado = $objDaoParcial->ModificarParcial(
            $datos['pId'],
            $datos['pnombre'],
            $datos['pIdPeriodo'],
            $datos['pfchInicio'],
            $datos['pfchTermino'],
        );

        // Ajustar la estructura de respuesta según el resultado devuelto por el DAO.
        if ($resultado['estado'] == "OK") {
            $resultado = [
                'estado' => 'OK',
                'mensaje' => $resultado['mensaje']
            ];
        } else {
            $resultado = [
                'estado' => 'Error',
                'mensaje' => $resultado['mensaje']
            ];
        }
    } else {
        // Solicitud inválida: ni Buscar ni Modificar fueron especificados correctamente.
        $resultado['mensaje'] = "Ocurrió un error inesperado. Contacta al administrador si el problema persiste.";
        error_log("Solicitud inválida: no se especificó 'Buscar' o 'Modificar'.");
    }
} catch (PDOException $e) {
    // Manejo de errores de base de datos.
    $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes." . $e->getMessage();
    error_log("Excepción PDO al modificar parcial: " . $e->getMessage());  
}

// Devolver la respuesta al cliente en formato JSON.
echo json_encode($resultado);
