<?php
?>

<div id="frmArea">
    <h2 class="mb-4">OFERTA</h2>

    <div class="row mb-3">
        <div class="col-12 text-end ">
            <button type="button" class="btn" style="background-color: #E74C3C; border-color: #E74C3C; color: white;"
                    onclick="location.href='index.php';">
                <i class="fas fa-arrow-circle-left"></i> Regresar
            </button>
            <button type="button" class="btn" style="background-color: #009475; border-color: #009475; color: white;"
                    onclick="">
                <i class="fas fa-plus-circle"></i> Nueva oferta
            </button>
        </div>
    </div>

    <table class="table table-hover" id="tableOferta">
        <thead>
        <tr class="table-dark text-center">
            <th>ID Oferta</th>
            <th>Grado</th>
            <th>Grupo</th>
            <th>Turno</th>
            <th>Estado</th>
            <th>ID Materia</th>
            <th>Nombre Materia</th>
            <th>Hrs. Teoricas</th>
            <th>Hrs. Practicas</th>
            <th>Creditos</th>
            <th>No. Unidades</th>
            <th>ID Docente</th>
            <th>Nombre Docente</th>
            <th>Opciones</th>
        </tr>
        </thead>
        <tbody class="table-success">
        <tr class="">
            <td>OF001</td>
            <td>1</td>
            <td>A</td>
            <td>Matutino</td>
            <td>Activo</td>
            <td>MAT101</td>
            <td>Matemáticas Básicas</td>
            <td>4</td>
            <td>2</td>
            <td>6</td>
            <td>5</td>
            <td>DOC001</td>
            <td>Laura Martínez González</td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusOferta('OF001', this.value, 'Matemáticas Básicas')">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </label>
                </div>
            </td>
        </tr>
        <tr class="">
            <td>OF002</td>
            <td>2</td>
            <td>B</td>
            <td>Vespertino</td>
            <td>Activo</td>
            <td>FIS203</td>
            <td>Física Aplicada</td>
            <td>3</td>
            <td>3</td>
            <td>6</td>
            <td>4</td>
            <td>DOC005</td>
            <td>Carlos Ramírez López</td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusOferta('OF002', this.value, 'Física Aplicada')">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </label>
                </div>
            </td>
        </tr>
        <tr class="">
            <td>OF003</td>
            <td>3</td>
            <td>C</td>
            <td>Matutino</td>
            <td>Inactivo</td>
            <td>PROG301</td>
            <td>Programación Avanzada</td>
            <td>2</td>
            <td>4</td>
            <td>6</td>
            <td>6</td>
            <td>DOC010</td>
            <td>Ana María Sánchez Díaz</td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusOferta('OF003', this.value, 'Programación Avanzada')">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </label>
                </div>
            </td>
        </tr>
        <tr class="">
            <td>OF004</td>
            <td>1</td>
            <td>D</td>
            <td>Vespertino</td>
            <td>Activo</td>
            <td>QUI105</td>
            <td>Química General</td>
            <td>3</td>
            <td>3</td>
            <td>6</td>
            <td>5</td>
            <td>DOC008</td>
            <td>Roberto Vázquez Mendoza</td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusOferta('OF004', this.value, 'Química General')">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </label>
                </div>
            </td>
        </tr>
        <tr class="">
            <td>OF005</td>
            <td>2</td>
            <td>A</td>
            <td>Matutino</td>
            <td>Activo</td>
            <td>BIO202</td>
            <td>Biología Celular</td>
            <td>4</td>
            <td>2</td>
            <td>6</td>
            <td>4</td>
            <td>DOC015</td>
            <td>Patricia Flores Torres</td>
            <td>
                <div class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-primary btn-sm d-flex align-items-center"
                            onclick="">
                        <i class="fas fa-edit me-1"></i>
                        <span>Editar</span>
                    </button>
                    <label>
                        <select class="form-select form-select-sm btn-warning"
                                style="width: auto; color: #212529; background-color: #ffc107; border-color: #ffc107;"
                                onchange="changeStatusOferta('OF005', this.value, 'Biología Celular')">
                            <option disabled selected>Cambiar estado</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </label>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</div>