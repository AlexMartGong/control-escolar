<div id="frmArea">
    <h2 class="mb-4">Baja</h2>

    <div class="row mb-3">
        <div class="col-12 text-end">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn btn-warning"
                    onclick="option('bajaTemporal', '');">
                <i class="fas fa-user-minus me-2"></i> Baja por no inscripción
            </button>
        </div>
    </div>
    <table class="table table-hover table-responsive table-striped" id="tableBaja">
        <thead>
        <tr class="table-dark text-center">
            <th>ID Baja</th>
            <th>ID Alumno</th>
            <th>Nombre Alumno</th>
            <th>Tipo Baja</th>
            <th>Fecha</th>
            <th>Estatus</th>
            <th>Opciones</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="text-center">1</td>
            <td class="text-center">20240101</td>
            <td>Juan Pérez García</td>
            <td class="text-center">Definitiva</td>
            <td class="text-center">2025-03-15</td>
            <td class="text-center"><span class="status-active">Aplicada</span></td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormBaja('modBaja','1');">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                </div>
            </td>
        </tr>
        <tr>
            <td class="text-center">2</td>
            <td class="text-center">20240102</td>
            <td>María López Hernández</td>
            <td class="text-center">Temporal</td>
            <td class="text-center">2025-02-10</td>
            <td class="text-center"><span class="status-active">Aplicada</span></td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormBaja('modBaja','2');">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                </div>
            </td>
        </tr>
        <tr>
            <td class="text-center">3</td>
            <td class="text-center">20240103</td>
            <td>Carlos Ramírez Sánchez</td>
            <td class="text-center">Definitiva</td>
            <td class="text-center">2025-01-20</td>
            <td class="text-center"><span class="status-active">Aplicada</span></td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="loadFormBaja('modBaja','3');">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</div>