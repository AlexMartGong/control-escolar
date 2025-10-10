<div id="frmArea">
    <h2 class="mb-4">Bajas</h2>

    <div class="row mb-3">
        <div class="col-12 d-flex flex-wrap justify-content-center justify-content-md-end gap-2">
            <!-- Botón regresar -->
            <button type="button" class="btn"
                style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>

            <!-- Botón agregar baja manual -->
            <button type="button" class="btn"
                style="background-color: #009475; color: white;"
                onclick="loadFormBajaAlumnos('bajaManual', '')">
                <i class="fas fa-plus-circle"></i> Agregar baja manual
            </button>

            <!-- Botón baja por no inscripción -->
            <button type="button" class="btn btn-warning"
                onclick="option('bajaTemporal','');">
                <i class="fas fa-user-minus me-2"></i> Baja por no Inscripción
            </button>
        </div>
    </div>

    <table class="table table-hover table-responsive table-striped" id="tablaBajas">
        <thead>
            <tr class="table-dark text-center">
                <th class="text-center">Id baja</th>
                <th class="text-center">Numero de control</th>
                <th class="text-center">Nombre alumno</th>
                <th class="text-center">Tipo de baja</th>
                <th class="text-center">Motivo</th>
                <th class="text-center">Fecha</th>
                <th class="text-center">Periodo</th>
                <th class="text-center">Estatus</th>
                <th class="text-center">Opciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>210112096</td>
                <td>Miguel Angel Lara Hermosillo</td>
                <td>Temporal</td>
                <td>El alumno tuvo un accidente en la cual nesesita una recuperación.</td>
                <td><?php echo date("Y-m-d"); ?></td>
                <td>Agosto 2025 - Enero 2026</td>
                <td><span class="badge bg-success">aplicada</span></td>
                <td>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary btn-sm d-flex align-items-center"
                           onclick="loadFormBajaAlumnos('modBaja','1');">
                            <i class="fas fa-edit me-1"></i>
                            <span>Editar</span>
                        </button>
                    </div>
                </td>
            <tr>
                <td>2</td>
                <td>210112085</td>
                <td>Jose Alberto Arias Camacho</td>
                <td>Definitiva</td>
                <td>El alumno ya no quizo asistir al plantel.</td>
                <td><?php echo date("Y-m-d"); ?></td>
                <td>Agosto 2025 - Enero 2026</td>
                <td><span class="badge bg-success">aplicada</span></td>
                <td>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormBajaAlumnos('modBaja','2');">
                            <i class="fas fa-edit me-1"></i>
                            <span>Editar</span>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>