<?php
// Datos de prueba para 5 carreras diferentes con estructura simplificada
$horariosData = [
        'Ingeniería en Sistemas Computacionales' => [
                ['clave_horario' => 'H001', 'semestre' => '1°', 'grupo' => 'A', 'turno' => 'Matutino'],
                ['clave_horario' => 'H002', 'semestre' => '2°', 'grupo' => 'B', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H003', 'semestre' => '3°', 'grupo' => 'A', 'turno' => 'Matutino'],
                ['clave_horario' => 'H004', 'semestre' => '4°', 'grupo' => 'C', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H005', 'semestre' => '5°', 'grupo' => 'A', 'turno' => 'Matutino'],
        ],
        'Ingeniería Industrial' => [
                ['clave_horario' => 'H006', 'semestre' => '1°', 'grupo' => 'B', 'turno' => 'Matutino'],
                ['clave_horario' => 'H007', 'semestre' => '2°', 'grupo' => 'A', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H008', 'semestre' => '3°', 'grupo' => 'C', 'turno' => 'Matutino'],
                ['clave_horario' => 'H009', 'semestre' => '4°', 'grupo' => 'B', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H010', 'semestre' => '6°', 'grupo' => 'A', 'turno' => 'Matutino'],
        ],
        'Ingeniería Electrónica' => [
                ['clave_horario' => 'H011', 'semestre' => '2°', 'grupo' => 'A', 'turno' => 'Matutino'],
                ['clave_horario' => 'H012', 'semestre' => '3°', 'grupo' => 'B', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H013', 'semestre' => '4°', 'grupo' => 'A', 'turno' => 'Matutino'],
                ['clave_horario' => 'H014', 'semestre' => '5°', 'grupo' => 'C', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H015', 'semestre' => '7°', 'grupo' => 'A', 'turno' => 'Matutino'],
        ],
        'Ingeniería Mecánica' => [
                ['clave_horario' => 'H016', 'semestre' => '1°', 'grupo' => 'C', 'turno' => 'Matutino'],
                ['clave_horario' => 'H017', 'semestre' => '2°', 'grupo' => 'A', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H018', 'semestre' => '4°', 'grupo' => 'B', 'turno' => 'Matutino'],
                ['clave_horario' => 'H019', 'semestre' => '6°', 'grupo' => 'A', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H020', 'semestre' => '8°', 'grupo' => 'B', 'turno' => 'Matutino'],
        ],
        'Ingeniería en Gestión Empresarial' => [
                ['clave_horario' => 'H021', 'semestre' => '1°', 'grupo' => 'A', 'turno' => 'Matutino'],
                ['clave_horario' => 'H022', 'semestre' => '3°', 'grupo' => 'B', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H023', 'semestre' => '5°', 'grupo' => 'A', 'turno' => 'Matutino'],
                ['clave_horario' => 'H024', 'semestre' => '7°', 'grupo' => 'C', 'turno' => 'Vespertino'],
                ['clave_horario' => 'H025', 'semestre' => '9°', 'grupo' => 'A', 'turno' => 'Matutino'],
        ]
];
?>
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
        <?php
        foreach ($horariosData as $nombreCarrera => $horarios):
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
                                                    onclick="loadFormHorario('modHorario', '<?= $fila['clave_horario'] ?>');">
                                                <i class="fas fa-edit me-1"></i>
                                                <span>Editar</span>
                                            </button>
                                            <button class="btn btn-danger btn-sm d-flex align-items-center"
                                                    onclick="eliminarHorario('<?= $fila['clave_horario'] ?>');">
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
            <?php
        endforeach;
        ?>
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