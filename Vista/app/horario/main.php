<?php
// Datos de prueba para 5 carreras diferentes
$horariosData = [
    'Ingeniería en Sistemas Computacionales' => [
        ['clave_horario' => 'H001', 'numero_de_control' => '20400001', 'nombre_de_alumno' => 'Juan Pérez García', 'clave_de_carrera' => 'ISC', 'nombre_de_carrera' => 'Ingeniería en Sistemas Computacionales', 'clave_de_materia' => 'SCC-1019', 'nombre_de_materia' => 'Programación Orientada a Objetos', 'turno' => 'Matutino', 'estado' => 'Activo'],
        ['clave_horario' => 'H002', 'numero_de_control' => '20400002', 'nombre_de_alumno' => 'María López Martínez', 'clave_de_carrera' => 'ISC', 'nombre_de_carrera' => 'Ingeniería en Sistemas Computacionales', 'clave_de_materia' => 'SCC-1023', 'nombre_de_materia' => 'Sistemas Operativos', 'turno' => 'Vespertino', 'estado' => 'Activo'],
        ['clave_horario' => 'H003', 'numero_de_control' => '20400003', 'nombre_de_alumno' => 'Carlos Rodríguez Sánchez', 'clave_de_carrera' => 'ISC', 'nombre_de_carrera' => 'Ingeniería en Sistemas Computacionales', 'clave_de_materia' => 'SCC-1025', 'nombre_de_materia' => 'Tópicos Avanzados de Programación', 'turno' => 'Matutino', 'estado' => 'Inactivo'],
        ['clave_horario' => 'H004', 'numero_de_control' => '20400004', 'nombre_de_alumno' => 'Ana Fernández López', 'clave_de_carrera' => 'ISC', 'nombre_de_carrera' => 'Ingeniería en Sistemas Computacionales', 'clave_de_materia' => 'SCC-1017', 'nombre_de_materia' => 'Lenguajes y Autómatas I', 'turno' => 'Vespertino', 'estado' => 'Activo'],
    ],
    'Ingeniería Industrial' => [
        ['clave_horario' => 'H005', 'numero_de_control' => '20400005', 'nombre_de_alumno' => 'Luis Gómez Torres', 'clave_de_carrera' => 'IND', 'nombre_de_carrera' => 'Ingeniería Industrial', 'clave_de_materia' => 'INC-1025', 'nombre_de_materia' => 'Investigación de Operaciones', 'turno' => 'Matutino', 'estado' => 'Activo'],
        ['clave_horario' => 'H006', 'numero_de_control' => '20400006', 'nombre_de_alumno' => 'Elena Morales Cruz', 'clave_de_carrera' => 'IND', 'nombre_de_carrera' => 'Ingeniería Industrial', 'clave_de_materia' => 'INC-1019', 'nombre_de_materia' => 'Ergonomía', 'turno' => 'Vespertino', 'estado' => 'Activo'],
        ['clave_horario' => 'H007', 'numero_de_control' => '20400007', 'nombre_de_alumno' => 'Roberto Silva Mendoza', 'clave_de_carrera' => 'IND', 'nombre_de_carrera' => 'Ingeniería Industrial', 'clave_de_materia' => 'INC-1023', 'nombre_de_materia' => 'Simulación', 'turno' => 'Matutino', 'estado' => 'Inactivo'],
        ['clave_horario' => 'H008', 'numero_de_control' => '20400008', 'nombre_de_alumno' => 'Patricia Herrera Ruiz', 'clave_de_carrera' => 'IND', 'nombre_de_carrera' => 'Ingeniería Industrial', 'clave_de_materia' => 'INC-1021', 'nombre_de_materia' => 'Control Estadístico de la Calidad', 'turno' => 'Vespertino', 'estado' => 'Activo'],
    ],
    'Ingeniería Electrónica' => [
        ['clave_horario' => 'H009', 'numero_de_control' => '20400009', 'nombre_de_alumno' => 'Diego Vargas Castro', 'clave_de_carrera' => 'IEL', 'nombre_de_carrera' => 'Ingeniería Electrónica', 'clave_de_materia' => 'ELC-1008', 'nombre_de_materia' => 'Circuitos Eléctricos', 'turno' => 'Matutino', 'estado' => 'Activo'],
        ['clave_horario' => 'H010', 'numero_de_control' => '20400010', 'nombre_de_alumno' => 'Sandra Jiménez Flores', 'clave_de_carrera' => 'IEL', 'nombre_de_carrera' => 'Ingeniería Electrónica', 'clave_de_materia' => 'ELC-1015', 'nombre_de_materia' => 'Microprocesadores', 'turno' => 'Vespertino', 'estado' => 'Activo'],
        ['clave_horario' => 'H011', 'numero_de_control' => '20400011', 'nombre_de_alumno' => 'Fernando Ramírez Ortega', 'clave_de_carrera' => 'IEL', 'nombre_de_carrera' => 'Ingeniería Electrónica', 'clave_de_materia' => 'ELC-1020', 'nombre_de_materia' => 'Sistemas de Comunicaciones', 'turno' => 'Matutino', 'estado' => 'Inactivo'],
        ['clave_horario' => 'H012', 'numero_de_control' => '20400012', 'nombre_de_alumno' => 'Mónica Delgado Rivera', 'clave_de_carrera' => 'IEL', 'nombre_de_carrera' => 'Ingeniería Electrónica', 'clave_de_materia' => 'ELC-1018', 'nombre_de_materia' => 'Sistemas Digitales', 'turno' => 'Vespertino', 'estado' => 'Activo'],
    ],
    'Ingeniería Mecánica' => [
        ['clave_horario' => 'H013', 'numero_de_control' => '20400013', 'nombre_de_alumno' => 'Alejandro Campos Vega', 'clave_de_carrera' => 'IME', 'nombre_de_carrera' => 'Ingeniería Mecánica', 'clave_de_materia' => 'MEC-1032', 'nombre_de_materia' => 'Termodinámica', 'turno' => 'Matutino', 'estado' => 'Activo'],
        ['clave_horario' => 'H014', 'numero_de_control' => '20400014', 'nombre_de_alumno' => 'Gabriela Medina Santos', 'clave_de_carrera' => 'IME', 'nombre_de_carrera' => 'Ingeniería Mecánica', 'clave_de_materia' => 'MEC-1028', 'nombre_de_materia' => 'Máquinas Hidráulicas', 'turno' => 'Vespertino', 'estado' => 'Activo'],
        ['clave_horario' => 'H015', 'numero_de_control' => '20400015', 'nombre_de_alumno' => 'Ricardo Aguilar Moreno', 'clave_de_carrera' => 'IME', 'nombre_de_carrera' => 'Ingeniería Mecánica', 'clave_de_materia' => 'MEC-1025', 'nombre_de_materia' => 'Manufactura Integrada por Computadora', 'turno' => 'Matutino', 'estado' => 'Inactivo'],
        ['clave_horario' => 'H016', 'numero_de_control' => '20400016', 'nombre_de_alumno' => 'Valeria Castro Peña', 'clave_de_carrera' => 'IME', 'nombre_de_carrera' => 'Ingeniería Mecánica', 'clave_de_materia' => 'MEC-1030', 'nombre_de_materia' => 'Procesos de Manufactura', 'turno' => 'Vespertino', 'estado' => 'Activo'],
    ],
    'Ingeniería en Gestión Empresarial' => [
        ['clave_horario' => 'H017', 'numero_de_control' => '20400017', 'nombre_de_alumno' => 'Andrés Rojas Guerrero', 'clave_de_carrera' => 'IGE', 'nombre_de_carrera' => 'Ingeniería en Gestión Empresarial', 'clave_de_materia' => 'GED-1008', 'nombre_de_materia' => 'Gestión de la Producción II', 'turno' => 'Matutino', 'estado' => 'Activo'],
        ['clave_horario' => 'H018', 'numero_de_control' => '20400018', 'nombre_de_alumno' => 'Natalia Gutiérrez Ramos', 'clave_de_carrera' => 'IGE', 'nombre_de_carrera' => 'Ingeniería en Gestión Empresarial', 'clave_de_materia' => 'GED-1012', 'nombre_de_materia' => 'Mercadotecnia', 'turno' => 'Vespertino', 'estado' => 'Activo'],
        ['clave_horario' => 'H019', 'numero_de_control' => '20400019', 'nombre_de_alumno' => 'Óscar Mendoza Luna', 'clave_de_carrera' => 'IGE', 'nombre_de_carrera' => 'Ingeniería en Gestión Empresarial', 'clave_de_materia' => 'GED-1015', 'nombre_de_materia' => 'Planeación Financiera', 'turno' => 'Matutino', 'estado' => 'Inactivo'],
        ['clave_horario' => 'H020', 'numero_de_control' => '20400020', 'nombre_de_alumno' => 'Carmen Espinoza Valdez', 'clave_de_carrera' => 'IGE', 'nombre_de_carrera' => 'Ingeniería en Gestión Empresarial', 'clave_de_materia' => 'GED-1010', 'nombre_de_materia' => 'Logística y Cadenas de Suministro', 'turno' => 'Vespertino', 'estado' => 'Activo'],
    ]
];
?>
<div id="frmArea">
    <h2 class="mb-4">Horarios por Carrera</h2>

    <div class="row mb-3">
        <div class="col-12 text-end">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="loadFormHorario('frmHorario','');">
                <i class="fas fa-plus-circle"></i> Agregar Horario
            </button>
            <button type="button" class="btn" style="background-color: #FF8C00; border-color: #FF8C00; color: black;"
                    onclick="loadFormHorario('modHorarioIndividual','');">
                <i class="fas fa-sync-alt"></i> Modificar Horario Individuales
            </button>
        </div>
    </div>

    <!-- Barra de búsqueda global -->
    <div class="row mb-4">
        <div class="col-md-6">
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input type="text" class="form-control" id="searchGlobal" placeholder="Buscar en todas las carreras...">
            </div>
        </div>
        <div class="col-md-6">
            <select class="form-select" id="carreraFilter">
                <option value="">Todas las carreras</option>
                <option value="ISC">Ingeniería en Sistemas Computacionales</option>
                <option value="IND">Ingeniería Industrial</option>
                <option value="IEL">Ingeniería Electrónica</option>
                <option value="IME">Ingeniería Mecánica</option>
                <option value="IGE">Ingeniería en Gestión Empresarial</option>
            </select>
        </div>
    </div>

    <!-- Contenedor para las tablas -->
    <div id="tablasContainer">
        <?php
        $carreraIndex = 0;
        foreach ($horariosData as $nombreCarrera => $horarios):
            $carreraClass = str_replace([' ', 'ñ'], ['', 'n'], $nombreCarrera);
            $carreraClass = preg_replace('/[^A-Za-z0-9]/', '', $carreraClass);
        ?>
        <div class="carrera-section mb-5" data-carrera="<?= array_keys($horariosData)[$carreraIndex] ?>" data-clave="<?= $horarios[0]['clave_de_carrera'] ?>">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h4 class="card-title mb-0">
                        <i class="fas fa-graduation-cap me-2"></i>
                        <?= $nombreCarrera ?> (<?= $horarios[0]['clave_de_carrera'] ?>)
                    </h4>
                </div>
                <div class="card-body">
                    <table class="table table-hover table-responsive table-striped horario-table" id="table<?= $carreraClass ?>">
                        <thead>
                        <tr class="table-dark text-center">
                            <th>Id horario</th>
                            <th>No. Control</th>
                            <th>Nombre del alumno</th>
                            <th>Clave Carrera</th>
                            <th>Carrera</th>
                            <th>Clave Materia</th>
                            <th>Materia</th>
                            <th>Turno</th>
                            <th>Estado</th>
                            <th>Opciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($horarios as $fila):
                                $badgeClass = ($fila['estado'] == 'Activo') ? "bg-success" : "bg-danger";
                            ?>
                            <tr class="text-center">
                                <td><?= $fila['clave_horario'] ?></td>
                                <td><?= $fila['numero_de_control'] ?></td>
                                <td><?= $fila['nombre_de_alumno'] ?></td>
                                <td><?= $fila['clave_de_carrera'] ?></td>
                                <td><?= $fila['nombre_de_carrera'] ?></td>
                                <td><?= $fila['clave_de_materia'] ?></td>
                                <td><?= $fila['nombre_de_materia'] ?></td>
                                <td><?= $fila['turno'] ?></td>
                                <td><span class="badge <?= $badgeClass ?>"><?= $fila['estado'] ?></span></td>
                                <td>
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-primary btn-sm d-flex align-items-center"
                                                onclick="loadFormHorario('modHorario', '<?= $fila['clave_horario'] ?>');">
                                            <i class="fas fa-edit me-1"></i>
                                            <span>Editar</span>
                                        </button>
                                        <label>
                                            <select class="form-select form-select-sm btn-warning"
                                                    style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                                    onchange="changeStatusHorario('<?= $fila['clave_horario'] ?>', this.value, '<?= $fila['estado'] ?>');">
                                                <option disabled selected>Cambiar estado</option>
                                                <option value="Activo">Activo</option>
                                                <option value="Inactivo">Inactivo</option>
                                            </select>
                                        </label>
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
        $carreraIndex++;
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