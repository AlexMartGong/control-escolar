 
 


<link rel="stylesheet" href="../css/styleInterno.css">

<div class="container" id="frmTeacher">
    <div class="row justify-content-center">
        <div class="ampliacion">
            <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                <i class="fa-solid fa-chalkboard-user me-3"></i>
                Registro de Nuevo Docente
                </h5>
            </div>
                <div class="card-body p-4">
                    <form>
                        <div class="mb-3">
                            <label for="clave" class="form-label">Clave del docente</label>
                            <div class="input-group">
                            <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                <input 
                                type="text" 
                                 maxlength="9"
                                 title="Solo letras, números y guion medio. Máximo 9 caracteres."
                                class="form-control" 
                                id="clavedocente" 
                                 oninput="verificarInputdocente('clavedocente','btnGuardarJ')"
                                placeholder="Ingrese la clave del docente" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <div class="input-group">
                            <span class="input-group-text bg-blue-light"><i class="fas fa-user"></i></span>
                                <input type="text"
                                maxlength="50"
                                title='Maximo 50 caracteres'
                                class="form-control" 
                                  oninput="verificarInputdocente('nombredocente','btnGuardarJ')"
                                id="nombredocente" 
                                placeholder="Ingrese el nombre completo" required>
                             </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="perfil" class="form-label">Perfil</label>
                            <div class="input-group">
                           <span class="input-group-text bg-blue-light"><i class="fa-solid fa-address-book"></i></span>
                                <input 
                                maxlength="50"
                                title='Maximo 50 caracteres'
                                class="form-control" 
                                type="text"
                                id="perfil_id" 
                                  oninput="verificarInputdocente('perfil_id','btnGuardarJ')"
                                placeholder="Ingrese su perfil" 
                                required
                                >
                           </div>
                         
                        </div>
                        
                        <div class="mb-4">
                                <label class="form-check-label" for="estado">Estado</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-blue-light"><i class="fas fa-check-circle"></i></span>
                                    <select  class="form-control" disabled id="perfil_Id" >
                                        <option value="activo" selected>Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                         </div>
                        

                    
                        <div class="row">
                            <div class="col-12 separarBotones gap-2">
                            <button type="button"
                                    id="btnGuardarJ"
                                    class="btn btn3 btn-primary"
                                    onclick="validarcamposDocente('guardar');" 
                                   disabled >
                                    <i class="fas fa-save me-2"></i>Guardar
                                </button>
                                <button type="button"
                                class="btn btn-outline-secondary" 
                                    onclick="clearArea('frmTeacher'); option('docente','')">
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