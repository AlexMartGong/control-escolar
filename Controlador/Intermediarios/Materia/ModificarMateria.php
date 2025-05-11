<?php

// Incluir archivos necesarios para conexión y acceso a datos
require '../../../Modelo/BD/ConexionBD.php';      // Clase para establecer conexión con la base de datos.
require '../../../Modelo/BD/ModeloBD.php';        // Configuración y parámetros de conexión (host, usuario, etc).
require '../../../Modelo/DAOs/MateriaDAO.php';    // Clase DAO que contiene los métodos para operaciones sobre la entidad "Materia".

// Obtener los datos recibidos por el cuerpo de la solicitud HTTP (generalmente vía fetch o axios)
$datos = json_decode(file_get_contents("php://input"), true);

// Registrar en el log los datos recibidos (útil para depuración)
error_log("Datos recibidos en PHP: " . json_encode($datos));

// Inicializar la estructura de respuesta por defecto con estado de error
$resultado = ['estado' => 'Error'];

// Crear instancia de conexión y DAO
$c = new ConexionBD($DatosBD);                 // Crear objeto de conexión con la configuración cargada
$conexion = $c->Conectar();                   // Establecer conexión con la base de datos
$objDaoMateria = new MateriaDAO($conexion);  // Crear instancia del DAO de Materia con la conexión activa

try {
    // Registrar log del flujo de ejecución
    error_log("Comprobando parámetros de la solicitud...");

    if (isset($datos['Buscar']) && $datos['Buscar'] === true) {

        // Verificar que se haya proporcionado el ID de la materia
        if (isset($datos['id'])) {
            error_log("Realizando búsqueda para Materia con ID: " . $datos['id']);

            // Llamar al método BuscarMateria del DAO
            $resultado = $objDaoMateria->BuscarMateria($datos['id']);

            // Si no se obtiene un resultado válido, registrar mensaje de error
            if (!$resultado) {
                $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar Materia: No se encontró la materia."];
                error_log("No se encontró la materia con ID: " . $datos['id']);
            }

        } else {
            // No se proporcionó el ID necesario para realizar la búsqueda
            $resultado = ['estado' => 'Error', 'mensaje' => "Error Buscar Materia: ID no proporcionado."];
            error_log("ID no proporcionado en la búsqueda de Materia.");
        }

    } elseif (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {

        // Validar que todos los datos necesarios estén presentes
        if (isset($datos['claveMateria'], $datos['nombre'], $datos['noUnidades'], $datos['hrsTeoricas'], $datos['hrsPracticas'], $datos['creditos'], $datos['claveCarrera'])) {
            error_log("Realizando modificación para la Materia con ID: " . $datos['claveMateria'] .
                      " Nombre: " . $datos['nombre']  . ", unidades: " . $datos['noUnidades'] . ", horasT:" . $datos['hrsTeoricas'] . ", horasP: " . $datos['hrsPracticas'] . ", creditos: " . $datos['creditos'] . " y claveCarrera: " . $datos['claveCarrera']);

            // Llamar al método ModificarMateria del DAO con los datos proporcionados
            $resultado = $objDaoMateria->ModificarMateria(
                $datos['claveMateria'],
                $datos['nombre'],
                $datos['noUnidades'],
                $datos['hrsTeoricas'],
                $datos['hrsPracticas'],
                $datos['creditos'],
                $datos['claveCarrera']
            );

            // Evaluar el resultado del proceso de modificación
            if ($resultado['estado'] == "OK") {
                $resultado = ['success' => true, 'mensaje' => $resultado['mensaje']];
                error_log("Materia actualizada correctamente. ID: " . $datos['claveMateria']);
            } else {
                $resultado = ['success' => false, 'mensaje' => $resultado['mensaje']];
                error_log("Error al actualizar la materia con ID: " . $datos['claveMateria']);
            }

        } else {
            // Faltan datos para realizar la modificación
            $resultado = ['success' => false, 'mensaje' => "Error Modificar Materia: Datos insuficientes."];
            error_log("Datos insuficientes para modificar la Materia.");
        }

    } else {
        // Ni Buscar ni Modificar fueron especificados correctamente
        $resultado['mensaje'] = "Error Modificar Materia: Solicitud inválida.";
        error_log("Solicitud inválida: no se especificó 'Buscar' o 'Modificar'.");
    }

} catch (PDOException $e) {
    // Captura errores relacionados con la base de datos
    $resultado['mensaje'] = "Error Modificar Materia: problemas en la base de datos; " . $e->getMessage();
    error_log("Error en la base de datos: " . $e->getMessage());
}

// Enviar la respuesta al cliente en formato JSON
echo json_encode($resultado);
?>





