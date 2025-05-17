//MALH
// Esta funcion que permite cargar los formularios de agregar Docente y modificarlo, no desde function.js
function loadFormJDocente(opc, id = "") {
    let url = "";
    if (opc === "frmDocente") {
        url = "docente/frmTeacher.php";
    } else if (opc === "modDocente") {
        url = "docente/modTeacher.php";
    }

    let datas = {id: id};

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
                                BuscarDocente(id);
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
function validarcamposDocente(opc) {
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

    switch (opc) {
        case 'guardar':


            if (clavedocente === '' || nombredocente === '' || perfil === '') {
                // Verificar cada campo y aplicar la clase si está vacío
                marcarError(clavedocenteEntrada, clavedocente);
                marcarError(nombreEntrada, nombredocente);
                marcarError(perfilEntrada, perfil);
                //Mostrar modal de error de captura de datos
                mostrarErrorCaptura('No se pueden dejar campos vacios. Verifique e intente de nuevo');
                deshabilitarbtnDocente(true, "btnGuardarJ");
            }

            //validamos que la clave de docente sea escrita correctamente
            else if (!regex.test(clavedocente)) {
                mostrarErrorCaptura('Formato de Clave invalido. Ejemplo: AAA-0000');
                clavedocenteEntrada.classList.add("entrada-error");
                deshabilitarbtnDocente(true, "btnGuardarJ");
            }

            //validamos que el nombre solo sontenga letras y espacios
            else if (!regexNombre.test(nombredocente)) {
                mostrarErrorCaptura(
                    "Nombre inválido. Solo se permiten letras y espacios");
                nombreEntrada.classList.add("entrada-error");
                nombreEntrada.focus();
                deshabilitarbtnDocente(true, "btnGuardarJ");

                //Si todo esta bien podemos almacenar los datos
            } else {
                deshabilitarbtnDocente(true, "btnGuardarJ");
                intentarGuardarDatos(); //funcion que manda a guardar los datos
            }
            break;

        //validaciones para el formulario de modificar

        case 'modificar':
            //Generamos la validacion
            if (nombredocente === '' || perfil === '') {
                // Verificar cada campo y aplicar la clase si está vacío
                marcarError(nombreEntrada, nombredocente);
                marcarError(perfilEntrada, perfil);
                //Mostrar modal de error de captura de datos
                mostrarErrorCaptura('No se pueden dejar campos vacios. Verifique e intente de nuevo');
            }
            //validamos que el nombre solo sontenga letras y espacios
            else if (!regexNombre.test(nombredocente)) {
                mostrarErrorCaptura("Nombre inválido. Solo se permiten letras y espacios.");
                nombreEntrada.classList.add("entrada-error");
                nombreEntrada.focus();
                deshabilitarbtnDocente(true, "btnGuardarJ");

                //Si todo esta bien podemos almacenar los datos
            } else {
                deshabilitarbtnDocente(true, "btnGuardarJ");
                ModificarDocente();
            }

            break;
    }
}

 // funcion que permite evaluar los campos correctamente mientras escribe en el input
function verificarInputdocente(idetiqueta, idbtn) {
    let input = document.getElementById(idetiqueta);
    const valor = input.value.trim();
    const estaVacio = valor === "";

    const iconerror = document.querySelector(`#${idetiqueta}`);

    const contenedor = input.closest('.mb-4');
    const errorPrevio = contenedor.querySelector('.errorscaracter');

    if (errorPrevio) {
        errorPrevio.remove();
        input.classList.remove("entrada-error");
        iconerror.classList.remove('is-invalid');
    }

    // Validaciones por tipo de campo
    switch(idetiqueta) {
        case "clavedocente":
            const regexClave = /^[A-Z]{3}-\d{4}$/;
            if (estaVacio) {
                mostrarErrorDocente(input, 'Este campo no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulario(idbtn);
            }
            if (!regexClave.test(valor)) {
                mostrarErrorDocente(input, 'Solo se permite tres letras mayusculas al inicio, un guión medio - y 4 numeros. Ejem. TED-0001');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulario(idbtn);
            }
            if(regexClave.test(valor)){ 
                verificarClaveDocente(valor, function(existe) {
                    if (existe) {
                        claveExistenteDocente(iconerror, input); 
                    } else {
                        console.log('La clave no existe y se puede usar.');
                    }
                    evaluarEstadoFormulario(idbtn); 
                });
            }
            break;

        case "nombredocente":
            const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
            if (estaVacio) {
                mostrarErrorDocente(input, 'Este campo no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulario(idbtn);
            }
            if (!soloLetras.test(valor)) {
                mostrarErrorDocente(input, 'No se permiten caracteres especiales. Solo letras y espacios.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulario(idbtn);
            }
            break;

        case "perfil_id":
            const soloLetras2 = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
            if (estaVacio) {
                mostrarErrorDocente(input, 'Este campo no puede estar vacío.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulario(idbtn);
            }
            if (!soloLetras2.test(valor)) {
                mostrarErrorDocente(input, 'No se permiten caracteres especiales. Solo letras y espacios.');
                input.classList.add("entrada-error");
                iconerror.classList.add('is-invalid');
                return evaluarEstadoFormulario(idbtn);
            }
            break;
    }

    // Siempre reevalúa el estado global al final
    evaluarEstadoFormulario(idbtn);
}

function evaluarEstadoFormulario(idbtn) {
    const clave = document.getElementById('clavedocente');
    const nombre = document.getElementById('nombredocente');
    const perfil = document.getElementById('perfil_id');

    const errores = document.querySelectorAll('.errorscaracter');

    const camposLlenos =
        clave.value.trim() !== '' &&
        nombre.value.trim() !== '' &&
        perfil.value.trim() !== '';

    const claveValida = /^[A-Z]{3}-\d{4}$/.test(clave.value.trim());
    const nombreValido = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/.test(nombre.value.trim());

    const todoBien = errores.length === 0 && camposLlenos && claveValida && nombreValido;

    deshabilitarbtnDocente(!todoBien, idbtn); // true = deshabilita, false = habilita
}
//funcion para mostrar el error de escritura
function mostrarErrorDocente( input ,mensaje) {

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
  function claveExistenteDocente( iconerror,input){
    mostrarErrorDocente(input, 'La clave ya existe intente con otra.');
    iconerror.classList.add('is-invalid');
    input.classList.add("entrada-error");
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
        guardarNuevoDocente();
        // throw new Error('Error de prueba');
    } catch (error) {
        ErrorDeIntentoDeGuardado('Error al intentar Guardar los datos');
    }
}

function changeStatusDocente(id, status, currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado del docente <strong>${id}</strong> a <strong>${
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
            `select[onchange="changeStatusDocente('${id}', this.value, '${currentStatus}')"]`
        );
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
    });

    // También resetear al cerrar el modal con la X o haciendo clic fuera
    modalElement.addEventListener("hidden.bs.modal", function () {
        const selectElement = document.querySelector(
            `select[onchange="changeStatusDocente('${id}', this.value, '${currentStatus}')"]`
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
                    `Cambiando estado de docente ${id} a ${
                        status === "1" ? "Activo" : "Inactivo"
                    }`
                );

                // Realizar petición AJAX para cambiar el estado
                $.ajax({
                    url: "../../Controlador/Intermediarios/Docente/CambiarEstadoD.php",
                    type: "POST",
                    data: json,
                    contentType: "application/json",
                    timeout: 10000, // 10 segundos de timeout
                    success: function (response) {
                        try {
                            if (response.estado === "OK") {
                                mostrarDatosGuardados(
                                    `El estado del docente ${id} ha sido cambiado a "${status}" correctamente.`,
                                    function () {
                                        option("docente", "");
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
            }
        )
    ;
}

/**
 * Funcion para guardar nuevo docente, toma los datos y los envia al intermediario correspondiente
 *
 * @function
 * @returns {boolean} Retorna `true` si los datos fueron enviados, o `false` si la validación falló.
 */
function guardarNuevoDocente() {
    // Obtener y limpiar los valores de los campos del formulario
    const id = document.getElementById("clavedocente").value.trim();
    const nombre = document.getElementById("nombredocente").value.trim();
    const perfil = document.getElementById("perfil_id").value.trim();
    // Validación: asegurar que ambos campos estén completos
    if (!id || !nombre || !perfil) {
      mostrarFaltaDatos("Por favor, llena todos los campos obligatorios.");
      return false;
    }
    // Construcción del objeto de datos a enviar
    const datos = {
      id: id,
      nombre: nombre,
      perfil: perfil,
    };
    // Convertir el objeto a JSON para el envío
    const json = JSON.stringify(datos);
    const url =
      "../../Controlador/Intermediarios/Docente/AgregarDocente.php";
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
              option("docente", "");
            });
          } else if (
            respuesta.estado === "ERROR" &&
            respuesta.mensaje &&
            respuesta.mensaje.toLowerCase().includes("id del docente ya existe")
          ) {
            // ID duplicado: mensaje específico
            mostrarErrorCaptura("El ID del docente ya existe. Por favor, usa otro.");
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
 * Función para buscar un Docente por ID.
 * Se llenan los campos del formulario con sus datos y se deshabilita el campo ID.
 * En caso contrario, se muestra un mensaje de error al usuario.
 */
function BuscarDocente(id) {
    let url = "../../Controlador/Intermediarios/Docente/ModificarDocente.php";
  
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
  
          document.getElementById("clavedocente").value = response.datos.clave_de_docente;
          document.getElementById("nombredocente").value = response.datos.docente;
          document.getElementById("perfil_id").value = response.datos.perfil_de_docente;
          document.getElementById("estado").value = response.datos.estado;
  
          document.getElementById("clavedocente").disabled = true;
        } else {
          sinres("Docente no encontrado.");
        }
      },
      "json"
    ).fail(function (xhr, status, error) {
      console.error("Error en la solicitud POST:", xhr.responseText);
      mostrarErrorCaptura("Error al buscar el Docente.");
    });
  }

  /*
 * Función para modificar el Docente.
 * Solo permite la modificación del nombre, manteniendo el ID inmutable.
 */
function ModificarDocente() {
    const id = document.getElementById("clavedocente").value.trim();
    const nombre = document.getElementById("nombredocente").value.trim();
    const perfil = document.getElementById("perfil_id").value.trim();
    
    if (!id || !nombre | !perfil)  {
      mostrarFaltaDatos("Debe completar todos los campos obligatorios.");
    }
  
    let datos = new Object();
    datos.idDocente = id;
    datos.nombre = nombre;
    datos.perfil = perfil;
    datos.Modificar = true;
  
    let json = JSON.stringify(datos);
    let url = "../../Controlador/Intermediarios/Docente/ModificarDocente.php";
    console.log("Datos JSON enviados:", json);
  
    $.post(
      url,
      json,
      function (response, status) {
        if (response.success) {
            mostrarDatosGuardados(response.mensaje, "");
            option("docente", "");
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

  /*
 * Función para verificar la clave del docente y si ya existe.
 */
  function verificarClaveDocente(clave, callback) {
    $.ajax({
        url: "../../Controlador/Intermediarios/Docente/VerificarClaveD.php",
        type: "POST",
        data: JSON.stringify({ clave: clave }),
        contentType: "application/json",
        dataType: "json",
        success: function (respuesta) {
            if (respuesta.existe) {
                callback(true);  // la clave ya existe
            } else {
                callback(false); // no existe, se puede usar
            }
        },
        error: function () {
            console.error("Error al verificar la clave del docente.");
            callback(false);
        }
    });
}
