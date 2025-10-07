<?php
// ==========================
//  Backend: Cargar Horarios
// ==========================
require '../../../Modelo/BD/ConexionBD.php';
require '../../../Modelo/BD/ModeloBD.php';
require '../../../Modelo/DAOs/HorarioDAO.php';

// Crear conexión a la BD
$objBD = new ConexionBD($DatosBD);
$objHoDAO = new HorarioDAO($objBD->Conectar());

// Ejecutar método que llama al SP
$res = $objHoDAO->vizualizarHorarios();

// ==========================
//  Transformar datos: agrupar por carrera
// ==========================
$horariosData = [];
if ($res['estado'] === "OK" && $res['respuestaSP'] === "Estado: Exito") {
    foreach ($res['datos'] as $fila) {
        $carrera = $fila['nombre_de_carrera'];
        if (!isset($horariosData[$carrera])) {
            $horariosData[$carrera] = [];
        }
        $horariosData[$carrera][] = [
            'clave_de_carrera' => $fila['clave_de_carrera'],
            'semestre'      => $fila['semestre'],
            'grupo'         => $fila['grupo'],
            'turno'         => $fila['turno'],
        ];
    }
}
?>

<!-- ==========================
     Frontend: Render dinámico
=========================== -->
<div id="frmArea">
    <h2 class="mb-4">Horarios por Carrera</h2>

    <div class="row mb-4">
        <div class="col-md-12 text-end">
            <button type="button" class="btn"
                    style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn"
                    style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="loadFormHorario('frmHorario','');">
                <i class="fas fa-plus-circle"></i> Agregar Horario
            </button>
            <button type="button" class="btn"
                    style="background-color: #FF8C00; border-color: #FF8C00; color: black;"
                    onclick="loadFormHorario('modHorarioIndividual','');">
                <i class="fas fa-sync-alt"></i> Modificar Horario Individuales
            </button>
        </div>
    </div>

    <!-- Contenedor para las tablas -->
    <div id="tablasContainer">
        <?php if (!empty($horariosData)): ?>
            <?php foreach ($horariosData as $nombreCarrera => $horarios): 
                $carreraClass = str_replace([' ', 'ñ'], ['', 'n'], $nombreCarrera);
                $carreraClass = preg_replace('/[^A-Za-z0-9]/', '', $carreraClass);
            ?>
                <div class="carrera-section mb-5" data-carrera="<?= $nombreCarrera ?>">
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-graduation-cap me-2"></i>
                                <?= $nombreCarrera ?>
                            </h4>
                        </div>
                        <div class="card-body">
                            <table class="table table-hover table-responsive table-striped horario-table"
                                   id="table<?= $carreraClass ?>">
                                <thead>
                                    <tr class="table-dark text-center">
                                        <th>Semestre</th>
                                        <th>Grupo</th>
                                        <th>Turno</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($horarios as $fila): ?>
                                        <tr class="text-center">
                                            <td><?= $fila['semestre'] ?></td>
                                            <td><?= $fila['grupo'] ?></td>
                                            <td><?= $fila['turno'] ?></td>
                                            <td>
                                                <div class="d-flex gap-2 justify-content-center">
                                                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                                                            onclick="loadFormHorario('modHorario', '<?= $fila['clave_de_carrera'] ?>','<?= $fila['semestre'] ?>','<?= $fila['grupo'] ?>','<?= $fila['turno'] ?>');">
                                                        <i class="fas fa-edit me-1"></i>
                                                        <span>Editar</span>
                                                    </button>
                                                    <button class="btn btn-danger btn-sm d-flex align-items-center"
                                                            onclick="changeStatusHorario('<?= $fila['clave_de_carrera'] ?>','<?= $fila['semestre'] ?>','<?= $fila['grupo'] ?>','<?= $fila['turno'] ?>');">
                                                        <i class="fas fa-trash me-1"></i>
                                                        <span>Eliminar</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="alert alert-warning">
                <?= $res['respuestaSP'] ?? 'No se encontraron horarios registrados.' ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Control de paginación -->
    <div class="row mt-4">
        <div class="col-12">
            <nav aria-label="Paginación de carreras">
                <ul class="pagination justify-content-center" id="paginationCarreras">
                    <!-- La paginación se generará dinámicamente con JavaScript -->
                </ul>
            </nav>
        </div>
    </div>
</div>
