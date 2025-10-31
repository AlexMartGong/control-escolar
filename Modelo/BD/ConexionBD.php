<?php
/**
 * Clase para gestionar la conexión a la base de datos.
 * Esta clase permite crear una conexión a la base de datos utilizando PDO.
 */
class ConexionBD {
    private $host;  // Almacena la dirección del host de la base de datos
    private $user;  // Almacena el nombre de usuario para la base de datos
    private $pass;  // Almacena la contraseña del usuario de la base de datos
    private $db;    // Almacena el nombre de la base de datos

    /**
     * Constructor de la clase, que inicializa los datos de conexión.
     * @param array $datos - Array con los datos de conexión (host, usuario, contraseña, base de datos).
     */
    public function __construct($datos) {
        $this->host = $datos['host'];
        $this->user = $datos['user'];
        $this->pass = $datos['pass'];
        $this->db = $datos['db'];
    }

    /**
     * Establece la conexión con la base de datos utilizando PDO.
     * @return PDO|false - Retorna un objeto PDO en caso de éxito, o false en caso de error.
     */
    function Conectar() {
        $conector = "";
        try {
            // Construcción de la cadena de conexión para PDO
            $cadena = "mysql:host=".$this->host.";dbname=".$this->db;
            // Intentar crear una nueva instancia de PDO para la conexión
            $conector = new PDO($cadena, $this->user, $this->pass);
            $conector->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Habilitar el modo de error de excepción
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            die("Error al conectar con la base de datos. Por favor, verifica la configuración.");
        }
        return $conector;  // Retorna el objeto de conexión
    }

}
?>
