function loadFormJefeCarrera(id) {
    let url = "";
    
    if (id === "none") {
        url = "career-manager/frmJefeCarrera.php";
    } else if (id === "mod") {
        url = "career-manager/modJefeCarrera.php";
    }

    let datas = { id: id };

    let container = $('#frmArea'); // Aseguramos que el contenedor está bien referenciado

    container.fadeOut(300, function () {
        clearArea('frmArea'); // Limpiamos el área antes de cargar el nuevo contenido

        $.post(url, JSON.stringify(datas), function (responseText, status) {
            try {
                if (status === "success") {
                    container.html(responseText).hide().fadeIn(500).css("transform", "translateY(-10px)").animate({
                        opacity: 1,
                        transform: "translateY(0px)"
                    }, 300);
                }
            } catch (e) {
                mostrarErrorCaptura('Error al cargar el formulario: ' + e);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            mostrarErrorCaptura('Error de conexión: ' + textStatus + ' - ' + errorThrown);
        });
    });
}


function changeStatusJefeCarrera(id, status, currentStatus) {
    // Si no hay un estado seleccionado (opción por defecto), no hacer nada
    if (!status || status === "Cambiar estado") {
        return;
    }

    // Crear el contenido del modal de confirmación
    let modalHTML = `
    <div class="modal fade" id="confirmStatusModal" tabindex="-1" aria-labelledby="confirmStatusModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title" id="confirmStatusModalLabel">
                        <i class="fas fa-exclamation-triangle me-2"></i>Confirmar cambio de estado
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3">
                        <i class="fas fa-sync-alt text-warning fa-4x"></i>
                    </div>
                    <p class="text-center">¿Está seguro de cambiar el estado del jefe de carrera <strong>${id}</strong> a <strong>${status === "1" ? "Activo" : "Inactivo"}</strong>?</p>
                    <p class="text-center text-danger">Esta acción puede afectar a los procesos académicos en curso.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnCancelar">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnConfirmar">Confirmar</button>
                </div>
            </div>
        </div>
    </div>`;

    // Remover modal anterior si existe
    let modalAnterior = document.getElementById('confirmStatusModal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById('confirmStatusModal');
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Configurar acción para el botón cancelar
    document.getElementById('btnCancelar').addEventListener('click', function () {
        // Resetear el select al cancelar
        const selectElement = document.querySelector(`select[onchange="changeStatusJefeCarrera('${id}', this.value, '${currentStatus}')"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
    });

    // También resetear al cerrar el modal con la X o haciendo clic fuera
    modalElement.addEventListener('hidden.bs.modal', function () {
        const selectElement = document.querySelector(`select[onchange="changeStatusJefeCarrera('${id}', this.value, '${currentStatus}')"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        modalElement.remove();
    });

    // Configurar acción para el botón confirmar
    document.getElementById('btnConfirmar').addEventListener('click', function () {
        // Cerrar el modal
        modal.hide();

        // Preparar datos para enviar
        let data = {
            id: id,
            status: status
        };

        // Convertir a JSON
        let json = JSON.stringify(data);

        console.log(`Cambiando estado de jefe de carrera ${id} a ${status === "1" ? "Activo" : "Inactivo"}`);

        // Realizar petición AJAX para cambiar el estado
        $.ajax({
            url: "career-manager/changeStatusJefeCarrera.php",
            type: 'POST',
            data: json,
            contentType: 'application/json',
            timeout: 10000, // 10 segundos de timeout
            success: function (response) {
                mostrarDatosGuardados(`El estado del jefe de carrera ${id} ha sido cambiado a "${status === "1" ? "Activo" : "Inactivo"}" correctamente.`, function () {
                    // Recargar la tabla de jefes de carrera después de cambiar el estado
                    loadFormJefeCarrera('none');
                });
                try {
                    // Mostrar mensaje de éxito
                } catch (e) {
                    mostrarErrorCaptura('Error al procesar la respuesta: ' + e.message);
                }
            },
            error: function (xhr, status, error) {
                mostrarErrorCaptura(`Error al cambiar el estado: ${status} - ${error}`);
            }
        });
    });
}

//Esta funcion permite evaluar los campos vacios del formulario frmManager y modJefe

function validarCampos2(msj,opc) {
    let nombreInput = document.getElementById('nombremod');//SE EXTRAE EL ID DEL CAMPO NOMBRE
    let idImput = document.getElementById('idmanager');//EXTRAE EL ID DEL CAMPO ID JEFE CARRERA
    let nombreRegistro = document.getElementById('nombreReagistro');//Extrae el ID de nombre en formulario de nuevo jefe de carrera
   
   
   
    let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios
    let regex2 = /^[0-9\s]+$/;// solo numeros y espacios 

   
   
    switch (opc){
     /*   case 'busqueda': case desabilitado por el momento
            let nombre = nombreInput.value.trim(); // Eliminar espacios en blanco al inicio y final
            let identrada = idImput.value.trim();

         if (nombre === '' && identrada ==='') {
             mostrarFaltaDatos(msj,'');
            idImput.classList.add("entrada-error");
            nombreInput.classList.add("entrada-error");

             //Queda desabilitado el botn hasta que se genere un cambio en el nombre
             deshabilitar(true, "modbtnj")
             
         } else if (!regex.test(nombre) && !regex2.test(identrada)){
            mostrarFaltaDatos("Solo se permiten letras y espacios.",'');
            nombreInput.classList.add("entrada-error"); // Agrega la clase si es inválido
            idImput.classList.add("entrada-error"); // Agrega la clase si es inválido

         }
         
         else{
          
            nombreInput.classList.remove("entrada-error"); // Se remueve la clase de Invalidar si la busqueda fue satisfactoria
            idImput.classList.remove ("entrada-error");
            //se habilita boton Modificar si se encentran datos de jefe de carrera y si se requiere s
           //deshabilitar(false, "modbtnj");

            //se desabilita el imput de ID Jefe de carrera si la busqueda fue correcta
            deshabilitar(true, "idmanager"); 

            //en caso de que la consulta no arrojo resltados por la busqueda entonces se llama a esta modal
            sinres('No se encontraron resultados en la busqueda');
         }
         
        break;
       */
      //permite modificar el jefe de carrera si todo esta bien
        case 'modificar':
            let nombrej = nombreInput.value.trim(); // Eliminar espacios en blanco al inicio y final
            let identradJ = idImput.value.trim();

            if (nombrej === '' /*|| identradJ === '' Desabilitado por el momento*/ ) {
                mostrarFaltaDatos(msj,''); //muestra el modal si hace falta valores
                
                 if(nombrej === ''){
                    document.getElementById('nombremod').focus();
                    nombreInput.classList.add("entrada-error"); // Agrega la clase si es inválido
                 }
                //se valida si antes de guardar hay caracteres especiales
            } else if (!regex.test(nombrej)){
                mostrarFaltaDatos("Solo se permiten letras y espacios.",'');
                    document.getElementById('nombremod').focus();
                    nombreInput.classList.add("entrada-error"); // Agrega la clase si es inválido
                 
                
            }
            else { 
                //modal que se muestra que se aguardaron datos correctamente
                mostrarDatosGuardados('Datos guardados correctamente', '')
                nombreInput.classList.remove("entrada-error"); // Remueve la clase si es válido
                idImput.classList.remove("entrada-error"); // se remueve la clase si es inválido
                deshabilitar(true, "modbtnj")
               
            }
               //se puede retornar un valor bool en caso de que todo este bien
             break;
       //Permite agregar un nuevo gefe de carrera si todo esta bien 
             case 'guardar':
                
               let nombreR = nombreRegistro.value.trim();

                if(nombreR === ''){
                    mostrarFaltaDatos(msj,''); //muestra el modal si hace falta valores
                    nombreRegistro.classList.add("entrada-error"); // Agrega la clase si es inválido
                   
                }
                else if (!regex.test(nombreR)){
                    mostrarFaltaDatos("Solo se permiten letras y espacios.",'');
                    nombreRegistro.classList.add("entrada-error"); // Agrega la clase si es inválido
                   
        }
                else { 
                    //modal que se muestra que se aguardaron datos correctamente
                    mostrarDatosGuardados('Datos guardados correctamente', '')
                    nombreRegistro.classList.remove("entrada-error"); // Remueve la clase si es válido
                    deshabilitar(true, "btnGuardarJ")
                }
                //se puede retornar un valor bool en caso de que todo este bien
                break;
    }
}

//funcion que permite ver si hay cambios en las entradas en modificar jefe de carrera
function verificarInput(idetiqueta, idbtn) {
    let input = document.getElementById(idetiqueta);
    let estaVacio = input.value.trim() === "";
    let nombreInput = document.getElementById('nombremod'); //extrae el id de campo nombre en modJefe
    let idImput = document.getElementById('idmanager');//EXTRAE EL ID DEL CAMPO ID JEFE CARRERA
  
    nombreInput.classList.remove("entrada-error"); // Remueve la clase si se a modificado algo
    idImput.classList.remove("entrada-error"); // se remueve la clase si se a modificado algo
     
     // Llamamos a la función para deshabilitar o habilitar el botón según el input
    deshabilitar(estaVacio, idbtn);

}
// funcion que permite verificar los cambios de las entradas en el formulario de agregar jefe carrera
function verificarInputfrm(idetiqueta, idbtn) {
    let input = document.getElementById(idetiqueta);
    let estaVacio = input.value.trim() === "";

    input.classList.remove("entrada-error"); // Remueve la clase si se a modificado algo
   
     // Llamamos a la función para deshabilitar o habilitar el botón según el input
    deshabilitar(estaVacio, idbtn);

}

//funcion para habilitar o desabilitar en timpo real 
function deshabilitar(estado, botonId) { 
    let boton = document.getElementById(botonId);
    
    if (boton) { 
        boton.disabled = estado; // Deshabilita si `estado` es `true`, habilita si es `false`
    } else {
       console.error("Botón no encontrado con ID:", botonId);
    }
}
