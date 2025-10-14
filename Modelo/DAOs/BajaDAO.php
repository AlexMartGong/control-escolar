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

}
