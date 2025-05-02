<?php
class CarreraDAO
{
    private $conector;

    /**
     * Constructor de la clase CarreraDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    //aqui va el metodo para agregar carrera
    public function AgregarCarrera($datos)
    {
        $clave = $datos->clave;
        $nombre = $datos->nombre;
        $idJefe = $datos->idJefe;

        try {
            $stmt = $this->conector->prepare("CALL spAgregarCarrera(:clave, :nombre, :idJefe, @mensaje)");
            $stmt->bindParam(':clave', $clave, PDO::PARAM_STR);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':idJefe', $idJefe, PDO::PARAM_STR);
            $stmt->execute();

            $select = $this->conector->query("select @mensaje as mensaje");
            $resultado = $select->fetch(PDO::FETCH_ASSOC);
            $mensaje = $resultado['mensaje'];

            if (strpos($mensaje, 'Exito') !== false) {
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
            return [
                'estado' => 'ERROR',
                'mensaje' => 'Excepcion: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Función para verificar la clave de la carrera y si ya existe una igual 
     */
public function existeClave($clave) {
    $sql = "SELECT COUNT(*) AS total FROM carrera WHERE claveCarrera = :clave";
    $stmt = $this->conector->prepare($sql);
    $stmt->bindParam(':clave', $clave);
    $stmt->execute();
    $fila = $stmt->fetch(PDO::FETCH_ASSOC);
    return $fila['total'] > 0;
}
}
