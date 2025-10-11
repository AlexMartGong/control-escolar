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
        $resultado = ['estado' => 'Error']; // Estado por defecto
        $c = $this->conector;

        try {
            // Ejecutar el procedimiento almacenado principal
            $sp = $c->prepare("CALL sp_Inscripciones_Cierre()");
            $sp->execute();

            // Obtener los datos devueltos por el SP
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);

            // ---------------------------------------
            // Caso 1: SP devuelve mensajes informativos
            // ---------------------------------------
            if (!empty($datos) && count($datos) === 1 && count($datos[0]) === 1) {

                $primeraFila = reset($datos); // Tomar la primera fila del arreglo de resultados del SP
                $mensajeSP   = $primeraFila[array_key_first($primeraFila)]; // Obtener el valor de la primera columna de esa fila

                // Validar mensajes conocidos del SP
                if ($mensajeSP === 'No es tiempo') {
                    $resultado['mensaje'] = "Todavía no se ha alcanzado la fecha de cierre de inscripciones, por lo que no se pueden aplicar las bajas por no inscripción.";
                    return $resultado; // Estado sigue siendo "Error"
                } elseif ($mensajeSP === 'Ya se aplicó') {
                    $resultado['mensaje'] = "Las bajas por no inscripción ya fueron aplicadas anteriormente, No se puede volver a realizar esta accion.";
                    return $resultado; // Estado sigue siendo "Error"
                }
            }

            // ---------------------------------------
            // Caso 2: SP devolvió registros aplicados
            // ---------------------------------------
            if (!empty($datos)) {
                $resultado['estado'] = 'OK'; // Hubo bajas aplicadas
                $resultado['datos'] = $datos; // Guardar registros para el front
                $resultado['mensaje'] = "La baja por no inscripción se ha aplicado correctamente a los alumnos correspondientes.";
            } else {
                // No hubo registros afectados
                $resultado['mensaje'] = "No se encontraron alumnos con estado 'Baja' para aplicar bajas por no inscripción en este periodo.";
            }
        } catch (PDOException $e) {
            // Manejo de errores de base de datos
            error_log("Error en la base de datos (AplicarBajasPorNoInscripcion): " . $e->getMessage());
            $resultado['mensaje'] = "Se produjo un error al intentar aplicar las bajas por no inscripción. Por favor, inténtalo nuevamente más tarde o contacta al soporte.";
        }

        return $resultado;
    }

}
