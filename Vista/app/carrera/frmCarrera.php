<link rel="stylesheet" href="../css/styleInterno.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">


<div class="container" id="fmrcarrera">
    <div class="row justify-content-center">
        <div class="ampliacion">
            <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                <i class="bi bi-journal-bookmark"></i>
                Registro de nueva Carrera
                </h5>
            </div>
                <div class="card-body p-4">
                    <form>
                        <div class="mb-4">
                            <label for="clave" class="form-label">Clave de Carrera</label>
                            <div class="input-group">
                            <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                <input 
                                type="text" 
                                 maxlength="15"
                                 title="Solo letras, números y guion medio. Máximo 9 caracteres."
                                class="form-control" 
                                id="clavecarrera" 
                                 oninput="verificarInputcarrera('clavecarrera','btnGuardarJ')"
                                placeholder="Ejem: IINF-2010-220" required>
                             
                            </div>  
                        </div>
                        
                        <div class="mb-4">
                            <label for="nombre" class="form-label">Nombre de Carrera</label>
                            <div class="input-group">
                            <span class="input-group-text bg-blue-light"><i class="bi bi-mortarboard"></i>
                            </span>
                                <input type="text"
                                maxlength="50"
                                title='Maximo 50 caracteres'
                                class="form-control" 
                                  oninput="verificarInputcarrera('nombrecarrera','btnGuardarJ')"
                                id="nombrecarrera" 
                                placeholder="Ingrese el nombre de carrera" required>
                             </div>

                        </div>
                        
                        <div class="mb-4">
                            <label for="perfil" class="form-label">CLave de Jefe de Carrera</label>
                            <div class="input-group">
                           <span class="input-group-text bg-blue-light"><i class="fa-solid fa-address-book"></i></span>
                                <input 
                                maxlength="9"
                                 title="Solo letras, números y guion medio. Máximo 9 caracteres."
                                class="form-control" 
                                type="text"
                                id="clavejefe" 
                                  oninput="verificarInputcarrera('clavejefe','btnGuardarJ')"
                                placeholder="Ejem: TEA-0001" 
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
                                    onclick="validarcamposCarrera('guardar');" 
                                   disabled >
                                    <i class="fas fa-save me-2"></i>Guardar
                                </button>
                                <button type="button"
                                class="btn btn-outline-secondary" 
                                    onclick="clearArea('fmrcarrera'); option('carrera','')">
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
