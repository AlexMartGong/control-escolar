<?php
// --------------------------------------------------------------
// Archivo Intermediario para gestionar la búsqueda y modificación de una Oferta.
// Este script recibe datos en formato JSON, procesa la solicitud según la acción
// indicada (Buscar o Modificar), y responde con los resultados en JSON.
// --------------------------------------------------------------

// Incluir archivos necesarios para conexión y acceso a datos
require '../../../Modelo/BD/ConexionBD.php';      // Clase para establecer conexión con la base de datos.
require '../../../Modelo/BD/ModeloBD.php';        // Configuración y parámetros de conexión (host, usuario, etc).
require '../../../Modelo/DAOs/OfertaDAO.php';    // Clase DAO que contiene los métodos para operaciones sobre la entidad "Oferta".

// Obtener los datos recibidos por el cuerpo de la solicitud HTTP (generalmente vía fetch o axios)
$datos = json_decode(file_get_contents("php://input"), true);

// Registrar en el log los datos recibidos (útil para depuración)
error_log("Datos recibidos en PHP: " . json_encode($datos));

// Inicializar la estructura de respuesta por defecto con estado de error
$resultado = ['estado' => 'Error'];

// Crear instancia de conexión y DAO
$c = new ConexionBD($DatosBD);                 // Crear objeto de conexión con la configuración cargada
$conexion = $c->Conectar();                   // Establecer conexión con la base de datos
$objDaoOferta = new OfertaDAO($conexion);    // Crear instancia del DAO de Oferta con la conexión activa

try {
    // -----------------------------------------
    // CASO 1: Buscar Oferta por ID
    // -----------------------------------------
    if (isset($datos['Buscar']) && $datos['Buscar'] === true) {

        // Verificar que se haya proporcionado el ID de la oferta
        if (isset($datos['id'])) {

            // Llamar al método BuscarOferta del DAO
            $resultado = $objDaoOferta->BuscarOferta($datos['id']);
        } else {

            $resultado['mensaje'] = "No se encontraron los datos de la oferta que intentas modificar. Por favor, intenta de nuevo.";
        }

        // -----------------------------------------
        // CASO 2: Modificar una Oferta existente
        // -----------------------------------------
    } elseif (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {

        // Validar que todos los datos necesarios estén presentes
        if (isset($datos['idOferta'], $datos['semestre'], $datos['grupo'], $datos['turno'], $datos['claveCarrera'], $datos['claveMateria'], $datos['idPeriodo'], $datos['claveDocente'])) 
                {
            

            // Llamar al método ModificarCarrera del DAO con los datos proporcionados
            $resultado = $objDaoOferta->ModificarOferta(
                $datos['idOferta'],
                $datos['semestre'],
                $datos['grupo'],
                $datos['turno'],
                $datos['claveCarrera'],
                $datos['claveMateria'],
                $datos['idPeriodo'],
                $datos['claveDocente']
            );

            // Evaluar el resultado del proceso de modificación
            if ($resultado['estado'] == "OK") {
                $resultado = ['success' => true, 'mensaje' => $resultado['mensaje']];
                error_log("Oferta actualizada correctamente. ID: " . $datos['idOferta']);
            } else {
                $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
                error_log("Error al actualizar la oferta con ID: " . $datos['idOferta']);
            }
        } else {
            // Faltan datos para realizar la modificación
            $resultado = ['success' => false, 'mensaje' => "No se encontraron los datos de la oferta que intentas modificar. Por favor, intenta de nuevo."];
            error_log("Datos: " . print_r($datos, true));
        }
    } else {
        // Ni Buscar ni Modificar fueron especificados correctamente
        $resultado['mensaje'] = "Ocurrio un error, por favor intentelo mas tarde.";
        error_log("Solicitud inválida: no se especificó 'Buscar' o 'Modificar'.");
    }
} catch (PDOException $e) {
    // Captura errores relacionados con la base de datos
    $resultado['mensaje'] = "Error Modificar Oferta: problemas en la base de datos; " . $e->getMessage();
    error_log("Error en la base de datos: " . $e->getMessage());
}

// Enviar la respuesta al cliente en formato JSON
echo json_encode($resultado);
