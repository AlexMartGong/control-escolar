<?php
/**
 * Archivo de configuración con los parámetros para la conexión a la base de datos.
 * Este archivo contiene las credenciales necesarias para conectar con la base de datos.
 */

$host = "localhost";  // Dirección del servidor de la base de datos (localhost en este caso)
$user = "root";       // Nombre de usuario para acceder a la base de datos
$pass = "root";       // Contraseña del usuario para acceder a la base de datos
$db = "controlescolar"; // Nombre de la base de datos con la que se desea trabajar

/**
 * Array que contiene los datos de conexión a la base de datos.
 * Se utiliza para pasar los parámetros necesarios al crear una instancia de la clase ConexionBD.
 */
$DatosBD = array(
    "host" => $host,  // Host de la base de datos
    "user" => $user,  // Usuario de la base de datos
    "pass" => $pass,  // Contraseña del usuario
    "db" => $db       // Nombre de la base de datos
);
?>
