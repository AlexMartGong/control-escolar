<?php
// Intermediario para MODIFICAR horario grupal

header('Content-Type: application/json; charset=utf-8');

require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/HorarioDAO.php';

$datos = json_decode(file_get_contents("php://input"), true) ?? [];

error_log("Datos recibidos en PHP (ModificarHorario.php): " . json_encode($datos));

$resultado = ['success' => false, 'mensaje' => 'Solicitud inválida'];

$c = new ConexionBD($DatosBD);
$conexion = $c->Conectar();
$objDaoHorario = new HorarioDAO($conexion);

try {
  if (isset($datos['Modificar']) && filter_var($datos['Modificar'], FILTER_VALIDATE_BOOLEAN)) {
        
    if (isset($datos['idCarrera'], $datos['semestre'], $datos['grupo'], $datos['turno'])) {

      $carrera  = trim($datos['idCarrera']);
      $semestre = (int)$datos['semestre'];
      $grupo    = trim($datos['grupo']);
      $turno    = trim($datos['turno']);

      // Validar que no estén vacíos después del trim
      if (empty($carrera) || empty($semestre) || empty($grupo) || empty($turno)) {
        $resultado = ['estado'=>'Error', 'mensaje'=>'Error: Campos obligatorios no pueden estar vacíos'];
      } else {
        $alumnos  = $datos['alumnos']  ?? [];
        $finales  = $datos['finales']  ?? [];
        $quitadas = $datos['quitadas'] ?? [];

        $resultado = $objDaoHorario->aplicarModificacionGrupal(
          $carrera, $semestre, $grupo, $turno, $alumnos, $finales, $quitadas
        );
      }

    } else {
      $camposFaltantes = [];
      if (!isset($datos['idCarrera'])) $camposFaltantes[] = 'idCarrera';
      if (!isset($datos['semestre'])) $camposFaltantes[] = 'semestre';
      if (!isset($datos['grupo'])) $camposFaltantes[] = 'grupo';
      if (!isset($datos['turno'])) $camposFaltantes[] = 'turno';
      
      $resultado = [
        'estado'=>'Error', 
        'mensaje'=>'Error Modificar Horario: Datos insuficientes. Faltan: ' . implode(', ', $camposFaltantes)
      ];
    }
  } else {
    $resultado = ['estado'=>'Error', 'mensaje'=>'Solicitud inválida: envía {"Modificar": true, ...}'];
  }

} catch (PDOException $e) {
  $resultado = ['estado'=>'Error', 'mensaje'=>'Error Modificar Horario: BD; ' . $e->getMessage()];
} catch (Exception $e) {
  $resultado = ['estado'=>'Error', 'mensaje'=>'Error Modificar Horario: ' . $e->getMessage()];
}

echo json_encode($resultado);

