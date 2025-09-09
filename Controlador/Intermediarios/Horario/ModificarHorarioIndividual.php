<?php
/**
 * Intermediario para la modificación individual de horarios de un alumno.
 * 
 * Flujo del proceso:
 *  1. Registrar bajas parciales de las ofertas seleccionadas.
 *  2. Eliminar los horarios actuales del alumno.
 *  3. Insertar los nuevos horarios individuales para las ofertas seleccionadas.
 *
 * El método valida los datos recibidos, utiliza los DAOs correspondientes,
 * maneja errores mediante logs y devuelve un JSON con el estado final.
 *
 * @param JSON $datos Entrada en formato JSON con:
 *               - pnoControl: número de control del alumno
 *               - psemestre: semestre del alumno
 *               - ofertas: arreglo con las claves de oferta a modificar
 * 
 * @return JSON Estado del proceso:
 *               - 'estado': 'OK' si todas las operaciones fueron exitosas, 'Error' en caso contrario
 */
 
error_reporting(0);             // Desactiva la salida de errores para no interferir con la respuesta JSON
ini_set('display_errors', 0);   // No mostrar errores en pantalla
header('Content-Type: application/json; charset=utf-8'); // Indica que la respuesta será JSON

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/HorarioDAO.php';
require '../../../Modelo/DAOs/OfertaDAO.php';

// Decodificar los datos JSON recibidos desde el front-end
$datos = json_decode(file_get_contents("php://input"));  

// Inicializar la respuesta por defecto con error
$resultado = ['estado' => 'Error'];

// Validar datos recibidos y asignar valores nulos si no existen
$datos->pnoControl = $datos->pnoControl ?? null;
$datos->psemestre  = $datos->psemestre ?? null;
$datos->ofertas    = $datos->ofertas ?? [];

// Crear conexión a la base de datos y objetos DAO
$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoHorario = new HorarioDAO($conexion);
$objDaoOferta  = new OfertaDAO($conexion);

try {
    // ------------------------------------------------
    // 1) Registrar bajas parciales para cada oferta
    // ------------------------------------------------
    foreach ($datos->ofertas as $idOferta) {
        // Llamar al método que registra la baja parcial en la oferta
        $respBaja = $objDaoOferta->RegistrarBajaParcialOferta(
            $datos->pnoControl,
            $idOferta,
            $datos->psemestre
        );

        // Verificar si ocurrió un error al registrar la baja
        if ($respBaja['estado'] !== "OK") {
            error_log("Intermediario: error al registrar baja parcial en oferta $idOferta para alumno {$datos->pnoControl}");
            $resultado['estado'] = 'Error';
            break; // Detener el proceso si hay error
        } else {
            $resultado['estado'] = "OK";
            error_log("Intermediario: éxito registrar baja parcial en oferta $idOferta para alumno {$datos->pnoControl}");
        }
    }

    // ------------------------------------------------
    // 2) Restablecer (eliminar) horarios actuales
    // ------------------------------------------------
    if ($resultado['estado'] !== 'Error') {
        // Llamar al DAO para eliminar horarios existentes del alumno
        $respRestablecer = $objDaoHorario->RestablecerHorarios($datos->pnoControl);
       
        if ($respRestablecer['estado'] !== "OK") {
            error_log("Intermediario: error al restablecer horarios del alumno {$datos->pnoControl}");
            $resultado['estado'] = 'Error';
        } else {
            $resultado['estado'] = "OK";
            error_log("Intermediario: éxito restablecer horarios del alumno {$datos->pnoControl}");
        }
    }

    // ------------------------------------------------
    // 3) Insertar nuevos horarios 
    // ------------------------------------------------
    if ($resultado['estado'] !== 'Error') {
        foreach ($datos->ofertas as $idOferta) {
            // Llamar al DAO para agregar el nuevo horario individual
            $respAgregar = $objDaoHorario->ModificarHorarioIndividual(
                $datos->pnoControl,
                $idOferta,
                $datos->psemestre
            );

            // Verificar si ocurrió un error al agregar el horario
            if ($respAgregar['estado'] !== "OK") {
                error_log("Intermediario: error al agregar horario con oferta $idOferta para alumno {$datos->pnoControl}");
                $resultado['estado'] = 'Error';
                break; // Detener si falla algún horario
            } else {
                $resultado['estado'] = "OK";
                error_log("Intermediario: éxito agregar horario con oferta $idOferta para alumno {$datos->pnoControl}");
            }
        }
    }

} catch (PDOException $e) {
    // Registrar excepción en log y marcar error
    error_log("Intermediario: excepción PDO al modificar horarios: " . $e->getMessage());
    $resultado['estado'] = 'Error';
}

// Devolver el resultado al front-end en formato JSON
echo json_encode($resultado);
