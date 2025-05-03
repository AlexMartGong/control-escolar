<link rel="stylesheet" href="../css/styleInterno.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">


<div class="container" id="modcarrera">
    <div class="row justify-content-center">
        <div class="ampliacion">
            <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                <i class="fas fa-graduation-cap me-2"></i>
                Modificar datos de carrera
                </h5>
            </div>
                <div class="card-body p-4">
                    <form>
                        <div class="mb-4">
                            <label for="clave" class="form-label">Clave de carrera</label>
                            <div class="input-group">
                            <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                <input 
                                type="text" 
                                 maxlength="15"
                                 title="Solo letras, números y guion medio. Máximo 9 caracteres."
                                class="form-control" 
                                id="clavecarrera" 
                                value="IINF-2010-220"
                                disabled>
                            </div>
 
                        </div>
                        
                        <div class="mb-4">
                            <label for="nombre" class="form-label">Nombre de carrera</label>
                            <div class="input-group">
                            <span class="input-group-text bg-blue-light"><i class="bi bi-mortarboard"></i></i></span>
                                <input type="text"
                                maxlength="50"
                                title='Maximo 50 caracteres'
                                class="form-control" 
                                  oninput="verificarInputcarrera('nombrecarrera','btnGuardarJ')"
                                id="nombrecarrera" 
                                value="Informatica"
                                placeholder="Ingrese el nombre de carrera" required>
                             </div>

                        </div>
                        
                        <div class="mb-4">
                            <div class="row g-2">
                            <label for="clavejefe" class="form-label">Jefe de carrera</label>
                                <div class="col">
                                <label for="clavejefe" class="form-label">Nombre</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-user-tie me-2"></i></span>
                                        <select id="listaNombres" class="form-select listaDespliege" onchange="retrasoSelect('clavejefe', 'btnGuardarJ' )">
                                            <!--Aqui se inyectaran las opciones -->
                                        </select>
                                    </div>
                                </div>
                                <div class="col">
                                <label for="clavejefe" class="form-label">Clave</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-blue-light"><i class="fas fa-id-card"></i></span>
                                        <input 
                                            type="text"
                                            id="clavejefe" 
                                            class="form-control" 
                                            disabled
                                            
                                        >
                                    </div>
                                </div>
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
                                    onclick="validarcamposCarrera('modificar')" 
                                   disabled >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                         Modificar
                                </button>
                                <button type="button"
                                class="btn btn-outline-secondary" 
                                    onclick="clearArea('modcarrera'); option('carrera','')">
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