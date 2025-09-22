<?php
header('Content-Type: application/json; charset=utf-8');
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/ParcialDAO.php';

try {
  $in = json_decode(file_get_contents('php://input'), true);
  $idPeriodo = (int)($in['idPeriodo'] ?? 0);
  if ($idPeriodo <= 0) { echo json_encode(['estado'=>'ERROR','mensaje'=>'idPeriodo inválido']); exit; }

  $c = new ConexionBD($DatosBD);
  $dao = new ParcialDAO($c->Conectar());
  $ctx = $dao->ContextoParcial($idPeriodo);

  echo json_encode($ctx, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['estado'=>'ERROR','mensaje'=>$e->getMessage()]);
}
