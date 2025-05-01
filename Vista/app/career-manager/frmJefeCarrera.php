<!--MALH-->

<?php
?>

<link rel="stylesheet" href="../css/styleInterno.css">

 <div class="container " id="frmAdd">
    <div class="row justify-content-center">
        <div class="ampliacion">
             <div class="card">
                 <!-- Header -->
                 <div class="card-header bg-primary text-white ">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-user-tie me-2"></i>
                             Registro de nuevo jefe de carrera
                    </h5>
                 </div>

                    <!--Incio de formulario-->
                    <div class="card-body">
                        <form>
                            <div class="mb-4">
                                <label for="id" class="form-label">Clave Jefe de Carrera:</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="idmanager"
                                        placeholder="Ejem: TEA-0001"
                                        maxlength="9"
                                        title="Solo letras, números y guion medio. Máximo 9 caracteres."
                                        oninput="verificarInputfrm('idmanager','btnGuardarJ')"
                                        disableds
                                        required>
                                </div>
                            </div>


                            <div class="mb-4">
                                <label for="nombreReagistro" class="form-label">Nombre del Jefe de Carrera:</label>
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
    
