<?php
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/HorarioDAO.php';

header('Content-Type: application/json'); // Para que el navegador entienda que es JSON

$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDao = new HorarioDAO($pdo);

$resultado = $objDao->BuscarPeriodoValido();

echo json_encode($resultado);
?>
