<!--MALH-->

<?php
?>

<link href="../css/Jefecarrera.css" rel="stylesheet">

<div class="container py-2" id="frmAdd">
  <div class="card shadow mx-auto" style="max-width: 768px;">
                    <!-- Header -->
                    <div class="card-header bg-primary text-white text-center p-3">
                    <h3 class="d-flex align-items-center justify-content-center mb-0 fs-4 fw-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" class="me-2" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Agregar nuevo jefe de carrera
                    </h3>
                    </div>

                    <!--Incio de formulario-->
                    <div class="card-body">
                        <form>
                            <div class="mb-4">
                                <label for="id" class="form-label">ID Jefe de Carrera:</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="idmanager"
                                        placeholder="TTT-0000"
                                        maxlength="9"
                                        title="Solo letras, números y guion medio. Máximo 9 caracteres."
                                        oninput="verificarInputfrm('idmanager','btnGuardarJ')"
                                        disableds
                                        required>
                                </div>
                            </div>


                            <div class="mb-4">
                                <label for="nombreReagistro" class="form-label">Nombre:</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-user"></i></span>
                                    <input type="text"
                                        class="form-control"
                                        id="nombreReagistro"
                                        placeholder="Ingrese nombre completo"
                                        maxlength="50"
                                        title="Solo letras y espacios. Máximo 50 caracteres."
                                        oninput="verificarInputfrm('nombreReagistro','btnGuardarJ')"
                                        required>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label for="estadoJefe" class="form-label">Estado:</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-check-circle"></i></span>
                                    <input type="text" class="form-control" id="estadoJefe" readonly value="Activo" disabled>
                                </div>
                            </div>

                            <!-- botones -->
                            <div class="row">
                                <div class="col-12 d-flex gap-2">
                                <button type="button"
                                        id="btnGuardarJ"
                                        class="btn btn3 btn-primary"
                                        onclick="validarCampos2('No puede dejar campos vacios ', 'guardar');" ;
                                        disabled>
                                        <i class="fas fa-save me-2"></i>Guardar
                                    </button>
                                    <button type="button"
                                    class="btn btn-outline-secondary" 
                                        onclick="clearArea('frmAdd');">
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
</div>