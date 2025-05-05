<?php
// --------------------------------------------------------------
// Archivo Intermediario para gestionar la búsqueda y modificación de una Carrera.
// Este script recibe datos en formato JSON, procesa la solicitud según la acción
// indicada (Buscar o Modificar), y responde con los resultados en JSON.
// --------------------------------------------------------------

// Incluir archivos necesarios para conexión y acceso a datos
require '../../../Modelo/BD/ConexionBD.php';      // Clase para establecer conexión con la base de datos.
require '../../../Modelo/BD/ModeloBD.php';        // Configuración y parámetros de conexión (host, usuario, etc).
require '../../../Modelo/DAOs/CarreraDAO.php';    // Clase DAO que contiene los métodos para operaciones sobre la entidad "Carrera".

// Obtener los datos recibidos por el cuerpo de la solicitud HTTP (generalmente vía fetch o axios)
$datos = json_decode(file_get_contents("php://input"), true);

// Registrar en el log los datos recibidos (útil para depuración)
error_log("Datos recibidos en PHP: " . json_encode($datos));

// Inicializar la estructura de respuesta por defecto con estado de error
$resultado = ['estado' => 'Error'];

// Crear instancia de conexión y DAO
$c = new ConexionBD($DatosBD);                 // Crear objeto de conexión con la configuración cargada
$conexion = $c->Conectar();                   // Establecer conexión con la base de datos
$objDaoCarrera = new CarreraDAO($conexion);  // Crear instancia del DAO de Carrera con la conexión activa

try {
    // Registrar log del flujo de ejecución
    error_log("Comprobando parámetros de la solicitud...");

    // -----------------------------------------
    // CASO 1: Buscar Carrera por ID
    // -----------------------------------------
    if (isset($datos['Buscar']) && $datos['Buscar'] === true) {

        // Verificar que se haya proporcionado el ID de la carrera
        if (isset($datos['id'])) {
            error_log("Realizando búsqueda para Carrera con ID: " . $datos['id']);

            // Llamar al método BuscarCarrera del DAO
            $resultado = $objDaoCarrera->BuscarCarrera($datos['id']);

            // Si no se obtiene un resultado válido, registrar mensaje de error
            if (!$resultado) {
                $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar Carrera: No se encontró la carrera."];
                error_log("No se encontró la carrera con ID: " . $datos['id']);
            }

        } else {
            // No se proporcionó el ID necesario para realizar la búsqueda
            $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar Carrera: ID no proporcionado."];
            error_log("ID no proporcionado en la búsqueda de Carrera.");
        }

    // -----------------------------------------
    // CASO 2: Modificar una Carrera existente
    // -----------------------------------------
    } elseif (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {

        // Validar que todos los datos necesarios estén presentes
        if (isset($datos['claveCarrera'], $datos['nombre'], $datos['idJefe'])) {
            error_log("Realizando modificación para la Carrera con ID: " . $datos['claveCarrera'] .
                      " Nombre: " . $datos['nombre']  . " y Jefe: " . $datos['idJefe']);

            // Llamar al método ModificarCarrera del DAO con los datos proporcionados
            $resultado = $objDaoCarrera->ModificarCarrera(
                $datos['claveCarrera'],
                $datos['nombre'],
                $datos['idJefe']
            );

            // Evaluar el resultado del proceso de modificación
            if ($resultado['estado'] == "OK") {
                $resultado = ['success' => true, 'mensaje' => $resultado['mensaje']];
                error_log("Carrera actualizada correctamente. ID: " . $datos['claveCarrera']);
            } else {
                $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
                error_log("Error al actualizar la carrera con ID: " . $datos['claveCarrera']);
            }

        } else {
            // Faltan datos para realizar la modificación
            $resultado = ['success' => false, 'mensaje' => "Error Modificar Carrera: Datos insuficientes."];
            error_log("Datos insuficientes para modificar la Carrera.");
        }

    } else {
        // Ni Buscar ni Modificar fueron especificados correctamente
        $resultado['mensaje'] = "Error Modificar Carrera: Solicitud inválida.";
        error_log("Solicitud inválida: no se especificó 'Buscar' o 'Modificar'.");
    }

} catch (PDOException $e) {
    // Captura errores relacionados con la base de datos
    $resultado['mensaje'] = "Error Modificar Carrera: problemas en la base de datos; " . $e->getMessage();
    error_log("Error en la base de datos: " . $e->getMessage());
}

// Enviar la respuesta al cliente en formato JSON
echo json_encode($resultado);
?>





