<?php
?>

<link rel="stylesheet" href="../css/styleInterno.css">

<div class="container" id="frmalumno">
    <div class="row justify-content-center">
        <div class="ampliacion">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-user-graduate me-2"></i>
                        Registro de nuevo alumno
                    </h5>
                </div>
                <div class="card-body p-4">
                    <form>
                        <div class="row">
                            <!-- No. Control -->
                            <div class="col-md-6 mb-3">
                                <label for="noControl" class="form-label">No. Control</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                    <input type="text" maxlength="10"
                                           class="form-control" id="noControl"
                                           placeholder="Ej: 12345678"
                                           oninput="verificarInputAlumno('noControl', 'btnGuardar')"
                                           title="10 caracteres máximo, puede iniciar con 'C'"
                                           required>
                                </div>
                                <div id="noControl-error" class="error-message d-none"></div>
                            </div>

                            <!-- Nombre -->
                            <div class="col-md-6 mb-3">
                                <label for="nombreAlumno" class="form-label">Nombre completo</label>
                                <div class="input-group">
                                        <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-user"></i>
                                        </span>
                                    <input type="text" maxlength="50"
                                           class="form-control" id="nombreAlumno"
                                           placeholder="Ingrese el nombre completo"
                                           oninput="verificarInputAlumno('nombreAlumno','btnGuardar')"
                                           title="Solo letras y espacios"
                                           required>
                                </div>
                                <div id="nombreAlumno-error" class="error-message d-none"></div>
                            </div>


                            <div class="mb-1 mt-2">
                                <div class="row g-2">

                                    <!-- Grado -->
                                    <div class="col-md-4 mb-3">
                                        <label for="grado" class="form-label">Semestre</label>
                                        <div class="input-group">
                                        <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-graduation-cap"></i>
                                        </span>
                                            <input type="number" class="form-control" id="grado"
                                                   value="1"
                                                   min="1" max="12"
                                                   placeholder="Ej: 3"
                                                   oninput="verificarInputAlumno('grado','btnGuardar')"
                                                   required>
                                        </div>
                                        <div id="grado-error" class="error-message d-none"></div>
                                    </div>

                                    <!-- Grupo -->
                                    <div class="col-md-4 mb-3">
                                        <label for="grupo" class="form-label">Grupo</label>
                                        <div class="input-group">
                                        <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-users"></i>
                                        </span>
                                            <select class="form-select listaDespliege" id="grupo"
                                                    onchange="verificarSelectAlumno('grupo','btnGuardar')"
                                                    required>
                                                <option value="" disabled selected>Seleccione grupo</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                                <option value="U">U</option>
                                            </select>
                                        </div>
                                        <div id="grupo-error" class="error-message d-none"></div>
                                    </div>

                                    <!-- Períodos en Baja -->
                                    <div class="col-md-4 mb-3">
                                        <label for="periodosEnBaja" class="form-label">Períodos en Baja</label>
                                        <div class="input-group">
                                    <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-calendar-times"></i>
                                        </span>
                                            <input type="number" class="form-control" id="periodosEnBaja"
                                                   min="0" max="3" value="0"
                                                   oninput="verificarInputAlumno('periodosEnBaja','btnGuardar')"
                                                   placeholder="0">
                                        </div>
                                        <div id="periodosEnBaja-error" class="error-message d-none"></div>
                                    </div>

                                </div>
                            </div>


                            <div class="mb-1 mt-2">
                                <div class="row g-2">

                                    <!-- Estado -->
                                    <div class="col-md-4 mb-3">
                                        <label for="estado" class="form-label">Estado</label>
                                        <div class="input-group">
                                        <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-check-circle"></i>
                                        </span>
                                            <input type="text" class="form-control readonly-field"
                                                   id="estado" value="Activo" readonly>
                                        </div>
                                    </div>

                                    <!-- Género -->
                                    <div class="col-md-4 mb-3">
                                        <label for="genero" class="form-label">Género</label>
                                        <div class="input-group">
                                        <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-venus-mars"></i>
                                        </span>
                                            <select class="form-select listaDespliege" id="genero"
                                                    onchange="verificarSelectAlumno('genero','btnGuardar')" required>
                                                <option value="" disabled selected>Seleccione género</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                            </select>
                                        </div>
                                        <div id="genero-error" class="error-message d-none"></div>
                                    </div>

                                    <!-- Turno -->
                                    <div class="col-md-4 mb-3">
                                        <label for="turno" class="form-label">Turno</label>
                                        <div class="input-group">
                                    <span class="input-group-text bg-blue-light">
                                            <i class="fas fa-clock"></i>
                                    </span>
                                            <select class="form-select listaDespliege" id="turno"
                                                    onchange="verificarSelectAlumno('turno','btnGuardar')" required>
                                                <option value="" disabled selected>Seleccione un turno</option>
                                                <option value="matutino">Matutino</option>
                                                <option value="vespertino">Vespertino</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 bg-light border rounded p-3 mt-4">
                            <div class="mb-3">
                                <label for="listaCarrera" class="form-label">Nombre de la Carrera</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light">
                                        <i class="fas fa-chalkboard"></i>
                                    </span>
                                    <select id="listaCarrera" class="form-select listaDespliege"
                                            onchange="verificarSelectAlumno('listaCarrera','btnGuardar')">
                                        <option value="" disabled selected>Seleccione una carrera</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="claveCarrera" class="form-label">Clave</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light">
                                        <i class="fas fa-id-card"></i>
                                    </span>
                                    <input type="text" id="claveCarrera" class="form-control" disabled>
                                </div>
                            </div>
                        </div>

                        <p></p>

                        <div class="row mt-4">
                            <div class="col-12 d-flex gap-2">
                                <button type="button" id="btnGuardar" class="btn btn3 btn-primary"
                                        onclick="validarCamposAlumno('No puede dejar campos vacíos', 'guardar');"
                                        disabled>
                                    <i class="fas fa-save me-2"></i>Guardar
                                </button>
                                <button type="button"
                                        class="btn btn-outline-secondary"
                                        onclick="clearArea('frmalumno'); option('student','');">
                                    <i class="fas fa-times-circle me-2"></i>Cancelar
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
