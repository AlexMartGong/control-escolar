<?php
// Intermediario para manejar solicitudes de búsqueda de periodos validos (Abierto o Pendiente).
// Recibe datos desde el cliente, procesa la solicitud y delega la lógica al DAO correspondiente.

// Importar clases necesarias para conexión y manejo de la base de datos.
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/HorarioDAO.php';

header('Content-Type: application/json'); 

// Crear instancia de conexión y del DAO de parciales.
$c = new ConexionBD($DatosBD);
$pdo = $c->Conectar();
$objDao = new HorarioDAO($pdo);

try{

    $resultado = $objDao->BuscarPeriodoValido();

}catch(PDOException $e){
    // Manejo de errores de base de datos.
    $resultado['mensaje'] = "No fue posible completar la operación en este momento. Por favor, intenta nuevamente en unos instantes." . $e->getMessage();
    error_log("Excepción PDO al buscar periodo valido: " . $e->getMessage());  
}

echo json_encode($resultado);
?>
