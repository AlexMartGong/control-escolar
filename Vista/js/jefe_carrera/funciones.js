// si se modifica algo de este archivo fabor de avisar a los front end
//MALH//

// Esta funcion que permite cargar los formularios de agregar y modificar jefe de carrera, no desde function.js
function loadFormJefeCarrera(opc, id = "") {
  let url = "";

  if (opc === "none") {
    url = "career-manager/frmJefeCarrera.php";
  } else if (opc === "mod") {
    url = "career-manager/modJefeCarrera.php";
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
              // Si es edición, llamar a BuscarJefeCarrera automáticamente
              if (opc === "mod" && id !== "") {
                BuscarJefeCarrera(id);
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
                    <p class="text-center">¿Está seguro de cambiar el estado del jefe de carrera <strong>${id}</strong> a <strong>${
    status === "1" ? "Activo" : "Inactivo"
  }</strong>?</p>
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
  let modalAnterior = document.getElementById("confirmStatusModal");
  if (modalAnterior) {
    modalAnterior.remove();
  }

  // Agregar el modal al documento
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mostrar el modal
  let modalElement = document.getElementById("confirmStatusModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Configurar acción para el botón cancelar
  document.getElementById("btnCancelar").addEventListener("click", function () {
    // Resetear el select al cancelar
    const selectElement = document.querySelector(
      `select[onchange="changeStatusJefeCarrera('${id}', this.value, '${currentStatus}')"]`
    );
    if (selectElement) {
      selectElement.selectedIndex = 0;
    }
  });

  // También resetear al cerrar el modal con la X o haciendo clic fuera
  modalElement.addEventListener("hidden.bs.modal", function () {
    const selectElement = document.querySelector(
      `select[onchange="changeStatusJefeCarrera('${id}', this.value, '${currentStatus}')"]`
    );
    if (selectElement) {
      selectElement.selectedIndex = 0;
    }
    modalElement.remove();
  });

  // Configurar acción para el botón confirmar
  document
    .getElementById("btnConfirmar")
    .addEventListener("click", function () {
      // Cerrar el modal
      modal.hide();

      // Preparar datos para enviar
      let data = {
        id: id,
        status: status,
      };

      // Convertir a JSON
      let json = JSON.stringify(data);

      console.log(
        `Cambiando estado de jefe de carrera ${id} a ${
          status === "1" ? "Activo" : "Inactivo"
        }`
      );

      // Realizar petición AJAX para cambiar el estado
      $.ajax({
        url: "../../Controlador/Intermediarios/JefeCarrera/CambiarEstadoJC.php",
        type: "POST",
        data: json,
        contentType: "application/json",
        timeout: 10000, // 10 segundos de timeout
        success: function (response) {
          try {
            if (response.estado === "OK") {
              mostrarDatosGuardados(
                `El estado del jefe de carrera ${id} ha sido cambiado a "${
                  status === "1" ? "Activo" : "Inactivo"
                }" correctamente.`,
                function () {
                  option("career-manager", "");
                }
              );
            } else {
              mostrarErrorCaptura(
                response.mensaje || "Error al cambiar el estado."
              );
            }
          } catch (e) {
            mostrarErrorCaptura("Error al procesar la respuesta: " + e.message);
          }
        },
        error: function (xhr, status, error) {
          mostrarErrorCaptura(
            `Error al cambiar el estado: ${status} - ${error}`
          );
        },
      });
    });
}

//Esta funcion permite evaluar los campos vacios del formulario frmManager y modJefe

function validarCampos2(msj, opc) {
  let nombreInput = document.getElementById("nombremod"); //SE EXTRAE EL ID DEL CAMPO NOMBRE
  let idImput = document.getElementById("idmanager"); //EXTRAE EL ID DEL CAMPO ID JEFE CARRERA
  let nombreRegistro = document.getElementById("nombreReagistro"); //Extrae el ID de nombre en formulario de nuevo jefe de carrera

  let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios
  let regex2 = /^[0-9\s]+$/; // solo numeros y espacios

  switch (opc) {
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
    case "modificar":
      let nombrej = nombreInput.value.trim(); // Eliminar espacios en blanco al inicio y final
      let identradJ = idImput.value.trim();

      if (nombrej === "" || identradJ === "") {
        mostrarFaltaDatos(msj, ""); //muestra el modal si hace falta valores
        deshabilitar(true, "modbtnj");

        if (nombrej === "") {
          nombreInput.classList.add("entrada-error"); // Agrega la clase si es inválido
        } else {
          idImput.classList.add("entrada-error");
        }
        //se valida si antes de guardar hay caracteres especiales
      } else if (!regex.test(nombrej)) {
        mostrarFaltaDatos("Solo se permiten letras y espacios.", "");
        document.getElementById("nombremod").focus();
        nombreInput.classList.add("entrada-error"); // Agrega la clase si es inválido
        deshabilitar(true, "modbtnj");
      } else {
        ModificarJefeCarrera();

        nombreInput.classList.remove("entrada-error"); // Remueve la clase si es válido
        idImput.classList.remove("entrada-error"); // se remueve la clase si es inválido
        deshabilitar(true, "modbtnj");
      }
      //se puede retornar un valor bool en caso de que todo este bien
      break;

    //Permite agregar un nuevo gefe de carrera si todo esta bien
    case "guardar":
      let nombreR = nombreRegistro.value.trim();
      let idJefe = idImput.value.trim();

      let regexId = /^[A-Za-z]{3}-\d{4}$/;
      let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,50}$/;

      if (!regexId.test(idJefe)) {
        mostrarErrorCaptura(
          "Formato de ID inválido. Debe contener 3 letras al inicio, guion y 4 números.",
          ""
        );
        idImput.classList.add("entrada-error");
        idImput.focus();
        return;
      } else if (!regexNombre.test(nombreR)) {
        mostrarErrorCaptura(
          "Nombre inválido. Solo se permiten letras y espacios (máx 50 caracteres).",
          ""
        );
        nombreRegistro.classList.add("entrada-error");
        nombreRegistro.focus();
        deshabilitar(true, "btnGuardarJ");
        return;
      }

      if (nombreR === "" || idJefe === "") {
        mostrarFaltaDatos(msj, ""); //muestra el modal si hace falta valores
        deshabilitar(true, "btnGuardarJ");

        if (nombreR === "") {
          nombreRegistro.classList.add("entrada-error"); // Agrega la clase si es inválido
        } else {
          idImput.classList.add("entrada-error");
        }
      } else if (!regex.test(nombreR)) {
        mostrarFaltaDatos("Solo se permiten letras y espacios.", "");
        nombreRegistro.classList.add("entrada-error"); // Agrega la clase si es inválido
        deshabilitar(true, "btnGuardarJ");
      } else {
        //modal que se muestra que se aguardaron datos correctamente
        nombreRegistro.classList.remove("entrada-error"); // Remueve la clase si es válido
        idImput.classList.remove("entrada-error");
        deshabilitar(true, "btnGuardarJ");
        guardarNuevoJefe();
      }
      //se puede retornar un valor bool en caso de que todo este bien
      break;
  }
}

function verificarInputfrm(idetiqueta, idbtn) {
  let input = document.getElementById(idetiqueta);
  const valor = input.value.trim();
  const estaVacio = valor === "";

  // Validaciones específicas por campo
  const regexId = /^[A-Z]{3}-\d{4}$/;
  const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;

  const clave = document.getElementById('idmanager');
  const nombre = document.getElementById('nombreReagistro');

  const contenedor = input.closest('.mb-4');
  let errorPrevio = contenedor.querySelector('.errorscaracter');

  // Limpiar errores anteriores si existen
  if (errorPrevio) {
    errorPrevio.remove();
    input.classList.remove("entrada-error");
  }

  // Validar campos 
  if (idetiqueta === "idmanager") {
    if (estaVacio) {
      mostrarError(input, 'Este campo no puede estar vacío.');
      input.classList.add("entrada-error");
    } else if (!regexId.test(valor)) {
      mostrarError(input, 'Tres letras mayúsculas, guión medio y 4 números. Ej: ABC-1234');
      input.classList.add("entrada-error");
    }
  } else {
    if (estaVacio) {
      mostrarError(input, 'Este campo no puede estar vacío.');
      input.classList.add("entrada-error");
    } else if (!soloLetras.test(valor)) {
      mostrarError(input, 'Solo letras y espacios permitidos.');
      input.classList.add("entrada-error");
    }
  }

  
  evaluarFormulario(idbtn);
}

function evaluarFormulario(idbtn) {
  const clave = document.getElementById('idmanager');
  const nombre = document.getElementById('nombreReagistro');

  const errores = document.querySelectorAll('.errorscaracter');

  const camposLlenos =
    clave.value.trim() !== '' &&
    nombre.value.trim() !== '';

  const claveValida = /^[A-Z]{3}-\d{4}$/.test(clave.value.trim());
  const nombreValido = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/.test(nombre.value.trim());

  const btn = document.getElementById(idbtn);

  if (errores.length === 0 && camposLlenos && claveValida && nombreValido) {
    deshabilitar(false, idbtn); // Habilita
  } else {
    deshabilitar(true, idbtn);  // Deshabilita
  }
}

//funcion que permite ver si hay cambios en las entradas en modificar jefe de carrera
function verificarInputmod(idetiqueta, idbtn) {
  let input = document.getElementById(idetiqueta);
  const valor = input.value.trim();
  const estaVacio = valor === "";
  const clave = document.getElementById('idmanager');
  const nombre = document.getElementById('nombremod');
  var vacios = true;

  //const nombre = document.getElementById('nombremod');
 //valores definidos que deve ingresar el usuario
 const regexId = /^[A-Z]{3}-\d{4}$/.test(valor); // permite la que insercion sea de acuerdo alos requerimientos
  const contieneCaracteresEspeciales = /[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]/.test(valor); // permite la insercion de letras, espacios, acentos y letras con tilde 
  
  if(clave.value.trim() === '' || nombre.value.trim() === ''  ){
    console.log("algo vacio");
     vacios = false;
  }


//if para validar los diferentes campos del formulario

  if(idetiqueta === "idmanager")  
  {
    const contenedor = input.closest('.mb-4');
    const errorPrevio = contenedor.querySelector('.errorscaracter');

    // Si el campo está vacío
    if (estaVacio) {
      if (!errorPrevio) {
        mostrarError(input, 'Este campo no puede estar vacío.');
      } else {
        errorPrevio.textContent = 'Este campo no puede estar vacío.';
      }
      input.classList.add("entrada-error");
      deshabilitar(true, idbtn);
      return;
    }

    // Si contiene caracteres especiales
    if (!regexId) {
      if (!errorPrevio) {
        mostrarError(input, 'Tres letras mayusculas al inicio, un guión medio - y 4 numeros.');
      } else {
        errorPrevio.textContent = 'Tres letras mayusculas al inicio, un guión medio - y 4 numeros.'; // si el que escribe se equiboca dos veces puedes cambiar el
      }
      input.classList.add("entrada-error");
      deshabilitar(true, idbtn);
      return;
    }
      // Si todo está bien, eliminamos errores
      if (vacios) {deshabilitar(false, idbtn);   }
      if(errorPrevio){ errorPrevio.remove(); input.classList.remove("entrada-error");  }
   

  }
  else
  {
   
      const contenedor = input.closest('.mb-4');
      const errorPrevio = contenedor.querySelector('.errorscaracter');

      // Si el campo está vacío
      if (estaVacio) {
        if (!errorPrevio) {
          mostrarError(input, 'Este campo no puede estar vacío.');
        } else {
          errorPrevio.textContent = 'Este campo no puede estar vacío.';
        }
        input.classList.add("entrada-error");
        deshabilitar(true, idbtn);
        return;
      }

      // Si contiene caracteres especiales
      if (contieneCaracteresEspeciales) {
        if (!errorPrevio) {
          mostrarError(input, 'No se permiten caracteres especiales. Solo letras y espacios.');
        } else {
          errorPrevio.textContent = 'No se permiten caracteres especiales. Solo letras y espacios.';
        }
        input.classList.add("entrada-error");
        deshabilitar(true, idbtn);
        return;
      }

       // Si todo está bien, eliminamos errores
       if (vacios) {deshabilitar(false, idbtn);  }
       if(errorPrevio){ errorPrevio.remove(); input.classList.remove("entrada-error");}

  }

}

//funcion para mostrar el error de escritura
function mostrarError( input ,mensaje) {

  const contenedorCampo = input.closest('.mb-4');

  // Eliminamos mensaje anterior si ya existe
  const errorPrevio = contenedorCampo.querySelector('.errorscaracter');
  if (errorPrevio) errorPrevio.remove();

  const alerta = document.createElement('p');
  alerta.textContent = mensaje;
  alerta.classList.add('errorscaracter'); 
  contenedorCampo.appendChild(alerta); // Insertamos debajo del input group
  /* por si quieren despues de 5 seg desarapecer el parrafo
  setTimeout(() => {
      alerta.remove();
  }, 5000);*/
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

/**
 * Funcion para guardar nuevo jefe de carrera, toma los datos y los envia al intermediario correspondiente
 *
 * @function
 * @returns {boolean} Retorna `true` si los datos fueron enviados, o `false` si la validación falló.
 */
function guardarNuevoJefe() {
  // Obtener y limpiar los valores de los campos del formulario
  const id = document.getElementById("idmanager").value.trim();
  const nombre = document.getElementById("nombreReagistro").value.trim();
  // Validación: asegurar que ambos campos estén completos
  if (!id || !nombre) {
    mostrarFaltaDatos("Por favor, llena todos los campos obligatorios.");
    return false;
  }
  // Construcción del objeto de datos a enviar
  const datos = {
    id: id,
    nombre: nombre,
  };
  // Convertir el objeto a JSON para el envío
  const json = JSON.stringify(datos);
  const url =
    "../../Controlador/Intermediarios/JefeCarrera/AgregarJefeCarrera.php";
  // Envío AJAX al servidor
  $.ajax({
    url: url,
    type: "POST",
    data: json,
    contentType: "application/json",
    dataType: "json",
    // Manejo de la respuesta exitosa
    success: function (respuesta) {
      try {
        console.log("Respuesta:", respuesta);
        if (!respuesta) throw new Error("Respuesta vacía");
        if (respuesta.estado === "OK") {
          // Mostrar modal de éxito y recargar formulario
          mostrarDatosGuardados(respuesta.mensaje, function () {
            option("career-manager", "");
          });
        } else if (
          respuesta.estado === "ERROR" &&
          respuesta.mensaje &&
          respuesta.mensaje.toLowerCase().includes("id del jefe ya existe")
        ) {
          // ID duplicado: mensaje específico
          mostrarErrorCaptura("El ID del Jefe ya existe. Por favor, usa otro.");
        } else {
          // Otro error del servidor
          mostrarErrorCaptura(
            respuesta.mensaje || "Error desconocido al guardar."
          );
        }
      } catch (error) {
        console.error("Fallo en el success:", error);
        mostrarErrorCaptura("Error inesperado procesando la respuesta.");
      }
    },
    // Manejo de errores de red o del servidor
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      mostrarErrorCaptura(`Error de conexión: ${status} - ${error}`);
    },
  });
  return true;
}

/*
 * Función para buscar un Jefe de Carrera por ID o nombre.
 * Si el registro existe, se llenan los campos del formulario con sus datos y se deshabilita el campo ID.
 * En caso contrario, se muestra un mensaje de error al usuario.
 */
function BuscarJefeCarrera(id) {
  let url =
    "../../Controlador/Intermediarios/JefeCarrera/ModificarJefeCarrera.php";

  let datos = { id: id, Buscar: true };
  let json = JSON.stringify(datos);

  $.post(
    url,
    json,
    function (response, status) {
      console.log("Respuesta del servidor:", response);
      console.log("Datos enviados:", json);

      if (status === "success" && response.estado === "OK" && response.datos) {
        console.log("Datos recibidos:", response.datos);

        document.getElementById("idmanager").value =
          response.datos.clave_de_jefe;
        document.getElementById("nombremod").value =
          response.datos.jefe_de_carrera;
        document.getElementById("estado").value = response.datos.estado;

        document.getElementById("idmanager").disabled = true;
      } else {
        sinres("Jefe de carrera no encontrado.");
      }
    },
    "json"
  ).fail(function (xhr, status, error) {
    console.error("Error en la solicitud POST:", xhr.responseText);
    mostrarErrorCaptura("Error al buscar el Jefe de Carrera.");
  });
}

/*
 * Función para modificar el Jefe de Carrera.
 * Solo permite la modificación del nombre, manteniendo el ID inmutable.
 */
function ModificarJefeCarrera() {
  const id = document.getElementById("idmanager").value.trim();
  const nombre = document.getElementById("nombremod").value.trim();

  if (!id || !nombre) {
    mostrarFaltaDatos("Debe completar todos los campos obligatorios.");
  }

  let datos = new Object();
  datos.idJefe = id;
  datos.nombre = nombre;
  datos.Modificar = true;

  let json = JSON.stringify(datos);
  let url =
    "../../Controlador/Intermediarios/JefeCarrera/ModificarJefeCarrera.php";
  console.log("Datos JSON enviados:", json);

  $.post(
    url,
    json,
    function (response, status) {

      if (response.success) {
        mostrarDatosGuardados(response.mensaje, "");
        option("career-manager", "");
      } else {
        mostrarErrorCaptura(response.mensaje);
      }

    },
    "json" // Indica que la respuesta esperada es JSON
  ).fail(function (xhr, status, error) {
    // Manejo de error
    console.error("Error en la solicitud POST:", xhr.responseText);
    mostrarErrorCaptura(
      "No se pudo conectar con el servidor. Inténtelo más tarde."
    );
  });
}
