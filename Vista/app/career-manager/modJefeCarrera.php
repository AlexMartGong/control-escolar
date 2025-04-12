<!--MALH-->


<link rel="stylesheet" href="../css/styleInterno.css">

<div class="container" id="frmmod">
  <div class="row justify-content-center">
    <div class="ampliacion">
       <div class="card">
               <!-- Header -->
            <div class="card-header bg-primary text-white ">
              <h5 class="card-title mb-0">
              <i class="fas fa-user-tie me-2"></i>
                Modificar jefe de carrera
              </h5>
            </div>

            <!-- Contenido del formulario -->
            <div class="card-body p-4">
              <form id="departmentHeadForm">

                <!-- ID y boton de Buscar -->
                <div class="mb-4">
                  
                    <label for="idmanager" class="form-label">Clave Jefe de Carrera:</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="idmanager"
                        placeholder="Ejem: TEA-0001"
                        maxlength="9"
                        title="Solo letras, números y guion medio. Máximo 9 caracteres."
                        class="form-control"
                        oninput="verificarInputmod('idmanager','modbtnj')"
                        required>
                       </div>
                  </div>

                  <!--boton de Buscar
                    <div class="col-md-4 d-flex align-items-end">
                      <button 
                        type="button"
                        onclick="validarCampos2('Ingrese Nombre o Id para continuar con la busqueda', 'busqueda');" 
                        class="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                        aria-label="Buscar jefe de carrera"
                        require
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Buscar
                      </button>
                    </div>
                  </div>
                  -->

                  <!-- nombre -->
                  <div class="mb-4 ">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="nombremod"
                        placeholder="Ingrese nombre completo"
                        class="form-control"
                        maxlength="50"
                        title="Solo letras y espacios. Máximo 50 caracteres."
                        oninput="verificarInputmod('nombremod','modbtnj')"
                        required>

                    </div>
                  </div>

                  <!-- Status -->
                  <div class="mb-4">
                    <label for="estado" class="form-label">Estado:</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <select
                        id="estado"
                        class="form-select form-control"
                        disabled>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>

                  <!-- botones -->
                  <div class="row">
                    <div class="col-12 d-flex gap-2">
                    
                    <button
                        type="button"
                        onclick="validarCampos2('No puede dejar campos vacios ','modificar');"
                        class="btn btn-primary d-flex align-items-center"
                        id="modbtnj"
                        disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Modificar
                      </button>
                    
                    <button
                      id="btnfail"
                        type="button"
                        onclick="clearArea('frmmod');"
                        class="btn btn-outline-secondary">
                        <i class="fas fa-times-circle me-2"></i>
                      Cancelar
                      </button>

                    
                    </div>
                  </div>
              </form>
            </div>
        </div>
      </div>
  </div>
</div>