<?php

class ParcialDAO
{

    Private $conector;

    /**
     * Constructor de la clase ParcialDAO.
     * @param PDO $conector - Objeto de conexión a la base de datos.
     */
    public function __construct($conector)
    {
        $this->conector = $conector;
    }


   /**
     * Obtiene la lista de parciales registrados en la base de datos.
     *
     * @return array Retorna un arreglo asociativo con las siguientes claves:
     *               - 'datos': Lista de registros parciales devueltos por el SP (solo si hay éxito).
     *               - 'estado': "OK" si la lista fue obtenida correctamente, 
     *                            ausente o vacío en caso contrario.
     *               - 'filas': Número total de registros obtenidos (0 si no hubo resultados).
     *               - 'respuestaSP': Mensaje textual devuelto por el SP 
     */
    public function MostrarParcial()
    {

        $c = $this->conector;

        try {
            // Preparar y ejecutar el procedimiento almacenado
            $sp = $c->prepare("CALL spMostrarParcial(@mensaje)");
            $sp->execute();

            // Obtener todos los datos retornados
            $datos = $sp->fetchAll(PDO::FETCH_ASSOC);
            $sp->closeCursor(); // Liberar resultado para permitir obtener @mensaje

            // Consultar el mensaje de salida del procedimiento almacenado
            $respuestaSP = $c->query("SELECT @mensaje");
            $mensaje = $respuestaSP->fetch(PDO::FETCH_ASSOC);
            $resultado['respuestaSP'] = $mensaje['@mensaje'];

            // Verificar si el procedimiento fue exitoso
            switch ($resultado['respuestaSP']) {
                case 'Estado: Lista de parciales retornada exitosamente':
                    $resultado['datos'] = $datos;
                    $resultado['estado'] = "OK";
                    $resultado['filas'] = count($datos);
                    error_log("[MostrarParcial] Exito");
                    break;

                case 'Error: No hay registros':
                    $resultado['filas'] = 0;
                    error_log("[MostrarParcial] No hay registros en la bd");
                    break;

                default:
                    $resultado['filas'] = 0;
                    error_log("[MostrarParcial] SP devolvió estado inesperado: " . $resultado['respuestaSP']);
                    break;
            }

        } catch (PDOException $e) {
            error_log("[MostrarParcial] Error en BD al Mostrar Parcial: " . $e->getMessage());
            
        }

        return $resultado;
    }

}