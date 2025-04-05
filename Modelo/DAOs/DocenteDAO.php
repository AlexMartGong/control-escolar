<?php
class DocenteDAO
{
    private $conector;

    /**
     * Constructor de la clase DocenteDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

//aqui va el metodo para agregar docente
public function AgregarDocente($datos)
    {
        $id = $datos->id;
        $nombre = $datos->nombre;
        $perfil = $datos->perfil;

        try {
            $stmt = $this->conector->prepare("CALL spAgregarDocente(:id, :nombre, :perfil, @mensaje)");
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':perfil', $perfil, PDO::PARAM_STR);
            $stmt->execute();

            $select = $this->conector->query("select @mensaje as mensaje");
            $resultado = $select->fetch(PDO::FETCH_ASSOC);
            $mensaje = $resultado['mensaje'];

            if (strpos($mensaje, 'Exito')!==false) {
                return [
                    'estado' => 'OK',
                    'mensaje' => 'Registro guardado correctamente.'
                ];
            } else {
                return [
                    'estado' => 'ERROR',
                    'mensaje' => $mensaje
                ];
            }
        } catch (PDOException $e) {
            return[
                'estado' => 'ERROR',
                'mensaje' => 'Excepcion: ' .$e->getMessage()
            ];
            }
        }
//aqui va el metodo de buscar docente por id

//aqui va el metodo de modificar docente

//Aqui va el metodo para cambiar de estatus docente   

function MostrarDocente()
{
    $resultado['estado'] = "OK";
    $c = $this->conector;

    try {
        error_log("tryeando mostrar docente");

        // Ejecutar procedimiento almacenado
        $sp = $c->prepare("CALL spMostrarDocentes(@mensaje)");
        $sp->execute();

        // Obtener los datos primero
        $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
        $sp->closeCursor(); // Libera el conjunto de resultados actual para permitir ejecutar otra consulta en la misma conexión (por ejemplo, SELECT @mensaje)

        // Ahora obtener el mensaje de salida
        $respuestaSP = $c->query("SELECT @mensaje");
        $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensaje['@mensaje'];

        error_log("Mensaje SP: " . $resultado['respuestaSP']);

        // Manejar mensaje de salida
        if ($resultado['respuestaSP'] == 'Estado: Exito') {
            $resultado['datos'] = $datos;
            $resultado['filas'] = count($datos);
        } else {
            $resultado['filas'] = 0;
            $resultado['estado'] = "Sin registros de Docente para mostrar";
        }

    } catch (PDOException $e) {
        $resultado['estado'] = "Error Mostrar Docente: " . $e->getMessage();
    }

    return $resultado;
}



    
}