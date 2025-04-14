
<link rel="stylesheet" href="../css/styleInterno.css">

<div class="container" id="modTeacher">
    <div class="row justify-content-center">
        <div class="ampliacion">
            <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                <i class="fa-solid fa-chalkboard-user me-3"></i>
                Modificar Datos de docente
                </h5>
            </div>
                <div class="card-body p-4">
                    <form>
                        <div class="mb-4">
                            <label for="clave" class="form-label">Clave del docente</label>
                            <div class="input-group">
                            <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                <input 
                                type="text" 
                                 maxlength="9"
                                 title="Solo letras, números y guion medio. Máximo 9 caracteres."
                                class="form-control" 
                                id="clavedocente" 
                                placeholder="Ejem: TED-0001" 
                                required
                                disabled>
                            </div>
                        </div>
                        
                        <div class="mb-4">
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
                        
                        <div class="mb-4">
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
                                    <select  class="form-control" disabled id="estado" >
                                        <option value="Activo" selected>Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                         </div>
                        
                        <div class="row">
                            <div class="col-12 separarBotones gap-2">
                            <button type="button"
                                    id="btnGuardarJ"
                                    class="btn btn-primary d-flex align-items-center"
                                    onclick="validarcamposDocente('modificar');" 
                                   disabled >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                         Guardar
                                </button>
                                <button type="button"
                                class="btn btn-outline-secondary" 
                                    onclick="clearArea('modTeacher'); option('docente','')">
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