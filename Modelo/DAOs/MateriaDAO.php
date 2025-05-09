<?php
class MateriaDAO
{
    private $conector;

    /**
     * Constructor de la clase MateriaDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    /**
     * Función para mostrar todos las Materias registradas.
     * Llama al procedimiento almacenado spMostrarMaterias.
     * @return array - Array con el estado de la operación y los datos obtenidos.
     */
    function MostrarMaterias()
    {
        $resultado['estado'] = "OK";
        $c = $this->conector;

        try {
          
            $sp = $c->prepare("CALL spMostrarMaterias(@mensaje)");
            $sp->execute();

            // Obtener los datos primero
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Libera el conjunto de resultados actual para permitir ejecutar otra consulta en la misma conexión (por ejemplo, SELECT @mensaje)

            // Ahora obtener el mensaje de salida
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            error_log("Mensaje spMateria: " . $resultado['respuestaSP']);

            // Manejar mensaje de salida
            if ($resultado['respuestaSP'] == 'Estado: Exito') {
                $resultado['datos'] = $datos;
                $resultado['filas'] = count($datos);
            } else {
                $resultado['filas'] = 0;
                $resultado['estado'] = "Sin registros de Materias para mostrar";
            }
            
        } catch (PDOException $e) {
            $resultado['estado'] = "Error Mostrar Materias: " . $e->getMessage();
        }

        return $resultado;
    }

}