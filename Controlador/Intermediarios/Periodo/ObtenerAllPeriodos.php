<?php
// Intermediario para manejar solicitudes obtencion de todos los periodos.
// Recibe datos desde el cliente, procesa la solicitud y delega la lógica al DAO correspondiente.

// Importar clases necesarias para conexión y manejo de la base de datos.
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/PeriodoDAO.php';

header('Content-Type: application/json'); 

$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDao = new PeriodoDAO($pdo);

try{

    $resultado = $objDao->MostrarPeriodos();

}catch(PDOException $e){
    // Manejo de errores de base de datos.
    $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes." . $e->getMessage();
    error_log("Excepción PDO al buscar todos los periodos: " . $e->getMessage());  
}

echo json_encode($resultado);
?>