//MALH
// Esta funcion que permite cargar los formularios de agregar Docente y modificarlo, no desde function.js
function loadFormJDocente(opc, id = "") {
    let url = "";
  
    if (opc === "frmDocente") {
      url = "docente/frmTeacher.php";
    } else if (opc === "modDocente") {
      url = "docente/modTeacher.php";
    }
  
    let datas = { id: id };
  
    let container = $("#frmArea");
  
    container.fadeOut(300, function () {
      clearArea("frmArea");
  
      $.post(url, JSON.stringify(datas), function (responseText, status) {
        try {
          if (status === "success") {
            container
              .html(responseText)
              .hide()
              .fadeIn(500, function () {
                // Si es edición, llamar a buscarDocente automáticamente
                if (opc === "modDocente" && id !== "") {
                  //(id);
                }
              })
              .css("transform", "translateY(-10px)")
              .animate(
                {
                  opacity: 1,
                  transform: "translateY(0px)",
                },
                300
              );
          }
        } catch (e) {
          mostrarErrorCaptura("Error al cargar el formulario: " + e);
        }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        mostrarErrorCaptura(
          "Error de conexión: " + textStatus + " - " + errorThrown
        );
      });
    });
  }




//Funcion que permite evaluar los campos antes de aguardar a un docente
function validarcamposDocente(opc){
    //se obtienen los campos a evaluar
    let clavedocenteEntrada = document.getElementById('clavedocente');
    let nombreEntrada = document.getElementById('nombredocente');
    let perfilEntrada = document.getElementById('perfil_id');
    let regex = /^[A-Z]{3}-\d{4}$/; // Tres letras mayúsculas, un guion medio y cuatro dígitos
    let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;


     //otenemos los valores limpios de las entradas
    let nombredocente = nombreEntrada.value.trim();
    let clavedocente = clavedocenteEntrada.value.trim();
    let perfil = perfilEntrada.value.trim();
   
    switch(opc){
        case 'guardar':
          

          if(clavedocente === '' || nombredocente=== '' || perfil === ''){
             // Verificar cada campo y aplicar la clase si está vacío
              marcarError(clavedocenteEntrada, clavedocente);
              marcarError(nombreEntrada, nombredocente);
              marcarError(perfilEntrada, perfil);
               //Mostrar modal de error de captura de datos
               mostrarErrorCaptura('No se pueden dejar campos vacios. Verifique e intente de nuevo');
               deshabilitarbtnDocente(true, "btnGuardarJ");
          }
      
        //validamos que la clave de docente sea escrita correctamente
         else if(!regex.test(clavedocente)){
            mostrarErrorCaptura('Formato de Clave invalido. Ejemplo: AAA-0000');
            clavedocenteEntrada.classList.add("entrada-error");
            deshabilitarbtnDocente(true, "btnGuardarJ");
         }
         
         //validamos que el nombre solo sontenga letras y espacios
         else if(!regexNombre.test(nombredocente)){
            mostrarErrorCaptura(
              "Nombre inválido. Solo se permiten letras y espacios");
            nombreEntrada.classList.add("entrada-error");
            nombreEntrada.focus();
            deshabilitarbtnDocente(true, "btnGuardarJ");
          
         //Si todo esta bien podemos almacenar los datos
        }else{
          deshabilitarbtnDocente(true, "btnGuardarJ");
          intentarGuardarDatos(); //funcion que manda a guardar los datos
        }
         break;
         
         //validaciones para el formulario de modificar

         case 'modificar':
         //Generamos la validacion 
          if(nombredocente=== '' || perfil === ''){
            // Verificar cada campo y aplicar la clase si está vacío
             marcarError(nombreEntrada, nombredocente);
             marcarError(perfilEntrada, perfil);
            //Mostrar modal de error de captura de datos
             mostrarErrorCaptura('No se pueden dejar campos vacios. Verifique e intente de nuevo');
         }
          //validamos que el nombre solo sontenga letras y espacios
          else if(!regexNombre.test(nombredocente)){
            mostrarErrorCaptura( "Nombre inválido. Solo se permiten letras y espacios.");
            nombreEntrada.classList.add("entrada-error");
            nombreEntrada.focus();
            deshabilitarbtnDocente(true, "btnGuardarJ");
          
         //Si todo esta bien podemos almacenar los datos
        }else{
          deshabilitarbtnDocente(true, "btnGuardarJ");
          intentarGuardarDatos(); //funcion que manda a guardar los datos
        }

          break;
    }
}
 // Función para marcar error en un campo vacío
  function marcarError(input, valor) {
   if (valor === '') {
      input.classList.add("entrada-error");
      
  } else {
      input.classList.remove("entrada-error");
        //desabilitar boton 
      deshabilitarbtnDocente(true, 'btnGuardarJ');
    
   }
          
 }
  
// funcion que permite verificar los cambios de las entradas en el formulario de agregar jefe carrera
function verificarInputdocente(idetiqueta, idbtn) {
  let input = document.getElementById(idetiqueta);
  let estaVacio = input.value.trim() === "";

    let clavedocenteEntrada = document.getElementById('clavedocente');
    let nombreEntrada = document.getElementById('nombredocente');
    let perfilEntrada = document.getElementById('perfil_id');

    //remover clases si se modifica algo
    clavedocenteEntrada.classList.remove("entrada-error");
    nombreEntrada.classList.remove("entrada-error");
    perfilEntrada.classList.remove("entrada-error");
  
  // Llamamos a la función para deshabilitar o habilitar el botón según el input
  deshabilitarbtnDocente(estaVacio, idbtn);
}

//funcion para habilitar o desabilitar en timpo real
function deshabilitarbtnDocente(estado, botonId) {
  let boton = document.getElementById(botonId);

  if (boton) {
    boton.disabled = estado; // Deshabilita si `estado` es `true`, habilita si es `false`
  } else {
    console.error("Botón no encontrado con ID:", botonId);
  }
}

function ErrorDeIntentoDeGuardado(mensaje) {
  // Crear el contenido del modal
  let modalHTML = `
  <div class="modal fade" id="errorCapturaModal" tabindex="-1" aria-labelledby="errorCapturaModalLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header bg-danger text-white">
                  <h5 class="modal-title" id="errorCapturaModalLabel">
                      <i class="fas fa-exclamation-triangle me-2"></i>Error
                  </h5>
                  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  <div class="text-center mb-3 me-5">
                      <i class="fas fa-times-circle text-danger fa-4x"></i>
                  </div>
                  <p class="text-center">${mensaje}</p>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              </div>
          </div>
      </div>
  </div>`;

  // Remover modal anterior si existe
  let modalAnterior = document.getElementById("errorCapturaModal");
  if (modalAnterior) {
      modalAnterior.remove();
  }

  // Agregar el modal al documento
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mostrar el modal
  let modalElement = document.getElementById("errorCapturaModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Eliminar el modal del DOM cuando se cierre
  modalElement.addEventListener("hidden.bs.modal", function () {
      modalElement.remove();
  });
}


// Estoy simulado en caso de un error al intertar guardar si todo esta bien,
// el error se muestra por perdida de conexion o problemas del equipo
//esta funcion puede ser usada para ustedes back end 
function intentarGuardarDatos() {
  try {
    //simulo un erro aqui 
    //encaso de que todo sea correcto se muestra el modal mostrarDatosGuardados()
     mostrarDatosGuardados('Datos Guardados Correctamente', '') // modal que semuestra al  aguardar datos correctamente
   // throw new Error('Error de prueba');
  } catch (error) {
    ErrorDeIntentoDeGuardado('Error al intentar Guardar los datos');
  }
}



