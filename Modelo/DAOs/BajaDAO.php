<?php

class BajaDAO
{

    private $conector;

    /**
     * Constructor de la clase BajaDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }

    public function AplicarBajasPorNoInscripcion()
    {
        $resultado = ['estado' => 'Error', 'mensaje' => 'Ocurrió un error desconocido.'];
        $c = $this->conector;

        try {
            $sp = $c->prepare("CALL sp_Inscripciones_Cierre()");
            $sp->execute();
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($datos) && count($datos) === 1 && count($datos[0]) === 1) {

                $mensajeSP = reset($datos)[array_key_first($datos[0])];

                if ($mensajeSP === 'No es tiempo') {
                    $resultado['mensaje'] = "Todavía no se ha alcanzado la fecha de cierre de inscripciones, no se pueden aplicar las bajas.";
                } elseif ($mensajeSP === 'Ya se aplicó') {
                    $resultado['mensaje'] = "La baja por no inscripción ya se aplicó para el periodo actual. No se puede realizar nuevamente.";
                }
            } else {
                $resultado['estado'] = 'OK';
            }
        } catch (PDOException $e) {
            error_log("Error BD (AplicarBajasPorNoInscripcion): " . $e->getMessage());
            $resultado['mensaje'] = "Se produjo un error al intentar aplicar las bajas por no inscripción. Inténtalo nuevamente más tarde.";
        }

        return $resultado;
    }

    /**
     * Función para mostrar todos las bajas registradas en el sistema.
     * Llama al procedimiento almacenado spMostrarBajas.
     * 
     * @return array Retorna un array con el estado de la operación, mensaje, datos y cantidad de filas obtenidas.
     */
    public function MostrarBajas()
{
    $resultado = [
        'estado' => 'OK',
        'filas' => 0,
        'datos' => [],
        'respuestaSP' => ''
    ];
    
    $c = $this->conector;

    try {
        // Preparar y ejecutar el procedimiento almacenado
        $sp = $c->prepare("CALL spMostrarBajas(@mensaje)");
        $sp->execute();

        // Obtener todos los datos retornados
        $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
        $sp->closeCursor();

        $respuestaSP = $c->query("SELECT @mensaje as mensaje");
        $mensajeData = $respuestaSP->fetch(PDO::FETCH_ASSOC);
        $resultado['respuestaSP'] = $mensajeData['mensaje'];

        error_log("Mensaje spBaja: " . $resultado['respuestaSP']);

        if (!empty($datos) && strpos($resultado['respuestaSP'], 'exitosamente') !== false) {
            $resultado['datos'] = $datos;
            $resultado['filas'] = count($datos);
        } else {
            $resultado['estado'] = "Sin registros";
            $resultado['filas'] = 0;
        }
        
    } catch (PDOException $e) {
        $resultado['estado'] = "Error: " . $e->getMessage();
    }

    return $resultado;
}
}
