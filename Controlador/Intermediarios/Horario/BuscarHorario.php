<?php
// Archivo Intermediario para buscar Horario

header('Content-Type: application/json; charset=utf-8');

require '../../../Modelo/BD/ConexionBD.php';   // Conexión a la base de datos.
require '../../../Modelo/BD/ModeloBD.php';     // Configuración de la base de datos.
require '../../../Modelo/DAOs/HorarioDAO.php'; // Operaciones relacionadas con el Horario.

$datos = json_decode(file_get_contents("php://input"), true) ?? [];

// Verificar si los datos llegan correctamente
error_log("Datos recibidos en PHP (BuscarHorario.php): " . json_encode($datos));

// Valor por defecto
$resultado = ['estado' => 'Error', 'mensaje' => 'Solicitud inválida'];

$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoHorario = new HorarioDAO($conexion);

try {
    error_log("Comprobando parámetros de la solicitud (BUSCAR)...");

    if (isset($datos['Buscar']) && filter_var($datos['Buscar'], FILTER_VALIDATE_BOOLEAN)) {
        // Búsqueda de Horario por ID
        if (!empty($datos['id'])) {
            error_log("Realizando búsqueda para Horario con ID: " . $datos['id']);
            $resultado = $objDaoHorario->BuscarHorario($datos['id']);

            if (!$resultado) {
                $resultado = [
                    'estado'  => 'Error',
                    'mensaje' => 'Error Buscar Horario: No se encontró el Horario.'
                ];
                error_log("No se encontró el Horario con ID: " . $datos['id']);
            }
        } else {
            $resultado = [
                'estado'  => 'Error',
                'mensaje' => 'Error Buscar Horario: ID no proporcionado.'
            ];
            error_log("ID no proporcionado en la búsqueda de Horario.");
        }
    } else {
        $resultado = [
            'estado'  => 'Error',
            'mensaje' => 'Solicitud inválida: envía {"Buscar": true, "id": "..."}'
        ];
        error_log("Solicitud inválida en BuscarHorario.php (falta Buscar=true).");
    }

} catch (PDOException $e) {
    $resultado = [
        'estado'  => 'Error',
        'mensaje' => 'Error Buscar Horario: problemas en la base de datos; ' . $e->getMessage()
    ];
    error_log("Error en la base de datos (BuscarHorario.php): " . $e->getMessage());
}

echo json_encode($resultado);
