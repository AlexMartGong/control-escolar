<?php
// -----------------------------------------------------------------------------
// Intermediario para gestionar la búsqueda y modificación de registros de Alumno.
// Este script recibe datos en formato JSON, interpreta la acción solicitada
// (Buscar o Modificar), y devuelve una respuesta estructurada en formato JSON.
// -----------------------------------------------------------------------------

require '../../../Modelo/BD/ConexionBD.php';    // Clase de conexión con la base de datos
require '../../../Modelo/BD/ModeloBD.php';      // Configuración de la conexión (host, usuario, etc.)
require '../../../Modelo/DAOs/AlumnoDAO.php';   // DAO con métodos para operaciones sobre la entidad Alumno

// Obtener los datos enviados al cuerpo de la solicitud HTTP (por fetch o axios)
$datos = json_decode(file_get_contents("php://input"), true);

// Log para depuración: datos recibidos
error_log("[Intermediario] Datos recibidos: " . json_encode($datos));

// Inicializar respuesta con estado de error por defecto
$resultado = ['estado' => 'Error'];

// Establecer conexión a la base de datos y crear instancia del DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoAlumno = new AlumnoDAO($conexion);

try {
    // -----------------------------------------------------------------
    // CASO 1: Buscar un Alumno por su número de control (ID)
    // -----------------------------------------------------------------
    if (isset($datos['Buscar']) && $datos['Buscar'] === true) {
        if (isset($datos['id'])) {
            // Ejecutar búsqueda en la base de datos
            $resultado = $objDaoAlumno->BuscarAlumno($datos['id']);
            error_log("[BuscarAlumno] Solicitud de búsqueda para ID: " . $datos['id']);
        } else {
            // ID no proporcionado
            $resultado['mensaje'] = "No se proporcionó el número de control del alumno.";
            error_log("[BuscarAlumno] Error: ID del alumno no recibido.");
        }

    // -----------------------------------------------------------------
    // CASO 2: Modificar los datos de un Alumno existente
    // -----------------------------------------------------------------
    } elseif (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {

        // Validar que todos los campos necesarios estén presentes
        if (isset($datos['noControl'], $datos['nombre'], $datos['genero'], $datos['semestre'], 
                  $datos['grupo'], $datos['turno'], $datos['claveCarrera'])) {
            
            // Ejecutar la modificación del alumno
            $resultado = $objDaoAlumno->ModificarAlumno(
                $datos['noControl'],
                $datos['nombre'],
                $datos['genero'],
                $datos['semestre'],
                $datos['grupo'],
                $datos['turno'],
                $datos['claveCarrera']
            );

            // Evaluar resultado de la operación
            if ($resultado['estado'] == "OK") {
                $resultado = ['success' => true, 'mensaje' => $resultado['mensaje']];
                error_log("[ModificarAlumno] Alumno actualizado correctamente. NC: " . $datos['noControl']);
            } else {
                $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
                error_log("[ModificarAlumno] Error al actualizar alumno. NC: " . $datos['noControl']);
            }
        } else {
            // Faltan datos requeridos
            $resultado = ['success' => false, 'mensaje' => "No se encontraron los datos del alumno que intentas modificar. Por favor, intenta de nuevo."];
            error_log("[ModificarAlumno] Datos incompletos: " . print_r($datos, true));
        }

    } else {
        // Ni "Buscar" ni "Modificar" fueron indicados correctamente
        $resultado['mensaje'] = "Ocurrio un error, por favor intentelo mas tarde.";
        error_log("[Intermediario] Ni Buscar ni Modificar fueron indicados correctamente.");
    }

} catch (PDOException $e) {
    // Error al acceder a la base de datos
    $resultado['mensaje'] = "Ocurrió un error al acceder a la base de datos. Inténtelo de nuevo más tarde.";
    error_log("[Intermediario] Error de base de datos: " . $e->getMessage());
}

// Devolver respuesta al cliente en formato JSON
echo json_encode($resultado);
