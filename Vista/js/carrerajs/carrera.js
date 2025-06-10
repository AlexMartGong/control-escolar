//Autor Miguel Angel
//Autor Alex Martinez Gonzalez
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.
Calquier duda consultar con el autor
*/

// Esta funcion que permite cargar los formularios de agregar carrera y modificarlo, no desde function.js
function loadFormJCarrera(opc, id = "") {
  let url = "";
  if (opc === "fmrcarrera") {
    url = "carrera/frmCarrera.php";
  } else if (opc === "modcarrera") {
    url = "carrera/modCarrera.php";
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
            .fadeIn(500)
            .promise() // Esperar a que termine la animación fadeIn
            .then(() => {
              if (opc === "modcarrera" && id !== "") {
                BuscarCarrera(id); // Buscar datos si es modificación
              }

              if (opc === "fmrcarrera") {
                return cargaRetrasadaDeDatos('add',"",'carrera');
              }
            })
            
            .catch((error) => {
              console.error("Error durante la carga del formulario:", error);
              mostrarErrorCaptura("Ocurrió un error al cargar los datos.");
            });

          // Animación secundaria (opcional)
          container.css("transform", "translateY(-10px)").animate(
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
      mostrarErrorCaptura("Error de conexión: " + textStatus + " - " + errorThrown);
    });
  });
}


//Funcion que permite evaluar los campos antes de aguardar a una carrera
function validarcamposCarrera(opc) {
  //se obtienen los campos a evaluar
  let clavecarrerae = document.getElementById("clavecarrera");
  let nombreEntrada = document.getElementById("nombrecarrera");
  let clavejefee = document.getElementById("clavejefe");
  let regex = /^[A-Z]{4}-\d{4}-\d{3}$/; //aqui espesificamos que como de ver el formato de la claveCarrera
  let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  let regexj = /^[A-Za-z]{3}-\d{4}$/; //aqui espesificamos que como de ver el formato de la clave de Jefe de carrera

  //otenemos los valores limpios de las entradas
  let nombrecarrera = nombreEntrada.value.trim();
  let clavecarrera = clavecarrerae.value.trim();
  let claveJefe = clavejefee.value.trim();

  switch (opc) {
    case "guardar":
      if (clavecarrera === "" || nombrecarrera === "" || claveJefe === "") {
        // Verificar cada campo y aplicar la clase si está vacío
        marcarErrorCarrera(clavecarrerae, nombrecarrera);
        marcarErrorCarrera(nombreEntrada, nombredocente);
        marcarErrorCarrera(clavejefee, claveJefe);
        //Mostrar modal de error de captura de datos
        mostrarErrorCaptura(
          "No se pueden dejar campos vacios. Verifique e intente de nuevo"
        );
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      }

      //validamos que la clave de docente y de ejefe de carrera sea escrita correctamente
      else if (!regex.test(clavecarrera) || !regexj.test(claveJefe)) {
        mostrarErrorCaptura("Clave Invalida, Verifique");
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      }

      //validamos que el nombre solo sontenga letras y espacios
      else if (!regexNombre.test(nombrecarrera)) {
        mostrarErrorCaptura(
          "Nombre inválido. Solo se permiten letras y espacios"
        );
        nombreEntrada.classList.add("entrada-error");
        nombreEntrada.focus();
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      } else {
        /*Si todo esta bien podemos almacenar los datos
                se desactiva el btn guardar, hasta que se realize un cambio este podra volver a guardar*/
        deshabilitarbtnDocente(true, "btnGuardarJ");
        intentarGuardarDatosCarrera("add");
      }
      break;

    //validaciones para el formulario de modificar
    case "modificar":
      if (clavecarrera === "" || nombrecarrera === "" || claveJefe === "") {
        // Verificar cada campo y aplicar la clase si está vacío
        marcarErrorCarrera(clavecarrerae, clavecarrera);
        marcarErrorCarrera(nombreEntrada, nombrecarrera);
        marcarErrorCarrera(clavejefee, claveJefe);
        //Mostrar modal de error de captura de datos
        mostrarErrorCaptura(
          "No se pueden dejar campos vacios. Verifique e intente de nuevo"
        );
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      } else if (!regexNombre.test(nombrecarrera)) {
        mostrarErrorCaptura(
          "Nombre inválido. Solo se permiten letras y espacios."
        );
        nombreEntrada.classList.add("entrada-error");
        nombreEntrada.focus();
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      } else {
        intentarGuardarDatosCarrera("mod");
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      }

      break;
  }
}

//Funcion para guardar los datos de los frm
function intentarGuardarDatosCarrera(opc) {
  try {
    // si todo esta bien se manda a llamar ala funcion que guarda los datos y se muestra el modal de datos aguardados correctamente
    if (opc === "add") guardarNuevaCarrera();
    // se borra el modal de aqui y se colocaen el lugar correcto
    else if (opc === "mod") {
      ModificarCarrera();
    }
  } catch (error) {
    // en caso de una falla se deabilita el boton y se muestra el modal con el problema
    ErrorDeIntentoDeGuardado("Error al intentar Guardar los datos");
    deshabilitarbtnCarrera(true, "btnGuardarJ");
  }
}

// Función para marcar error en un campo vacío
function marcarErrorCarrera(input, valor) {
  if (valor === "") {
    input.classList.add("entrada-error");
  } else {
    input.classList.remove("entrada-error");
  }
}

// funcion que permite evaluar los campos que esten correctamente mientras el usuario escribe
function verificarInputcarrera(idetiqueta, idbtn) {
  let input = document.getElementById(idetiqueta);
  const valor = input.value.trim();
  const estaVacio = valor === "";
  const iconerror = document.querySelector(`#${idetiqueta}`);
  const contenedor = input.closest(".mb-4");
  const errorPrevio = contenedor.querySelector(".errorscaracter");

  if (errorPrevio) {
    errorPrevio.remove();
    input.classList.remove("entrada-error");
    iconerror.classList.remove("is-invalid");
  }

  // Validaciones por tipo de campo
  switch (idetiqueta) {
    case "clavecarrera":
      const regexClavec = /^[A-Z]{4}-\d{4}-\d{3}$/;

      if (estaVacio) {
        mostrarErrorCarrera(input, "Este campo no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariocarrera(idbtn);
      }
      if (!regexClavec.test(valor)) {
        mostrarErrorCarrera(
          input,
          "Solo se permite cuatro letras mayusculas al inicio, un guión -, 4 dijitos y 3 dijitos al final. Ejem. IINF-2010-220"
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariocarrera(idbtn);
      }
      if (regexClavec.test(valor)) {
        verificarClaveCarrera(valor, function (existe) {
          if (existe) claveExistenteCarrera(iconerror, input);

          evaluarEstadoFormulariocarrera(idbtn);
        });
      }
      break;

    case "nombrecarrera":
      const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
      if (estaVacio) {
        mostrarErrorCarrera(input, "Este campo no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariocarrera(idbtn);
      }
      if (!soloLetras.test(valor)) {
        mostrarErrorDocente(
          input,
          "No se permiten caracteres especiales. Solo letras y espacios."
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariocarrera(idbtn);
      }
      break;

    case "clavejefe":
      const regexClave = /^[A-Z]{3}-\d{4}$/;
      if (estaVacio) {
        mostrarErrorCarrera(input, "Este campo no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariocarrera(idbtn);
      }
      if (!regexClave.test(valor)) {
        mostrarErrorCarrera(
          input,
          "Solo se permite tres letras mayusculas al inicio, un guión medio - y 4 numeros. Ejem. TEA-0001"
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariocarrera(idbtn);
      }

      break;
  }
  evaluarEstadoFormulariocarrera(idbtn);
}

// funcion que permite evaluar campos que todo se este cumpliendo adecuadamente.
// manda a llamar la funcion para habilitar o desabilitar el boton de acuerdo si todo esta bien
function evaluarEstadoFormulariocarrera(idbtn) {
  const clave = document.getElementById("clavecarrera");
  const nombre = document.getElementById("nombrecarrera");
  const clavej = document.getElementById("clavejefe");
  const errores = document.querySelectorAll(".errorscaracter");

  const camposLlenos =
    clave.value.trim() !== "" &&
    nombre.value.trim() !== "" &&
    clavej.value.trim() !== "";

  const claveValida = /^[A-Z]{4}-\d{4}-\d{3}$/.test(clave.value.trim());
  const nombreValido = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/.test(nombre.value.trim());
  const clavejefe = /^[A-Z]{3}-\d{4}$/.test(clavej.value.trim());

  const todoBien =
    errores.length === 0 &&
    camposLlenos &&
    claveValida &&
    nombreValido &&
    clavejefe;

  deshabilitarbtnCarrera(!todoBien, idbtn); // true = deshabilita, false = habilita
}

//funcion para mostrar el error de escritura
function mostrarErrorCarrera(input, mensaje) {
  const contenedorCampo = input.closest(".mb-4");

  // Sequita el error si ya existia antes
  const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
  if (errorPrevio) errorPrevio.remove();
  const alerta = document.createElement("p");
  alerta.textContent = mensaje;
  alerta.classList.add("errorscaracter");
  contenedorCampo.appendChild(alerta); // Insertamos debajo del input group y dentro del contenedorcampo

  /* por si quieren despues de 5 seg desarapecer el parrafo
    setTimeout(() => {
        alerta.remove();
    }, 5000);*/
}

//funcion que iyecta clases de css para inidcar que algo estara mal
function claveExistenteCarrera(iconerror, input) {
  mostrarErrorCarrera(input, "La clave ya existe intente con otra.");
  iconerror.classList.add("is-invalid");
  input.classList.add("entrada-error");
}

//funcion para habilitar o desabilitar cualquier boton
function deshabilitarbtnCarrera(estado, botonId) {
  let boton = document.getElementById(botonId);
  if (boton) {
    boton.disabled = estado; // Deshabilita si estado es true, habilita si es false
  } else {
    console.error("Botón no encontrado con ID:", botonId);
  }
}

// funcion para inyectar opciones al select
//espero esto sea de ayuda xd
// si lo fue, mayormente xd
//exelente

/* la opcion 'add' es para inyectar las opciones en el select en el formulario de agregar
las reglas cambian para modificar opcion 'mod', por eso sera distinto el codigo?
esto es por que hora tiene que ir un nombre con su clave al dar en el boton de editar
dependiendo del id de la carrera se cargara el id del jefe de carrera y su nombre con el que se guardo
ademas en la lista de despliege aparecera los demas jefes de carrera por si el usuario quiere cambiar de jefe
*/
//Para Mandar a llamar la funcion bueno lo que se hace es que se ingresa el id del jefe que esta asociado al Id de carrera y este lo cargara
//ejemplo cargarNombresEnSelect(opc, idJefeCarrera) opc se remplaza por mod y idjefeCarrera por ENC-1234 como se muestra en cargaRetrasadaDeDatos() arriba

function cargarNombresEnSelect(opc, idJefeCarrera) {
  switch (opc) {
    //No tocar este codigo, este es para el formulario de agregar
    case "add":
      $.ajax({
        url: "../../Controlador/Intermediarios/Carrera/ObtenerJefesCarrera.php",
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
          const select = $("#listaNombres");
          select.empty();
          select.append(
            "<option disabled selected>Seleccione un nombre</option>"
          );

          // Llenar el select con datos de la BD
          respuesta.forEach(function (jefe) {
            select.append(
              `<option value="${jefe.clave}" data-clave="${jefe.clave}">${jefe.nombre}</option>`
            );
          });

          // Evento para actualizar la clave cuando se seleccione un jefe
          select.off("change").on("change", function () {
            const claveSeleccionada =
              $(this).find("option:selected").data("clave") || "";
            $("#clavejefe").val(claveSeleccionada);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error al cargar jefes:", status, error);
          mostrarErrorCaptura("Error al cargar nombres de jefes de carrera.");
        },
      });
      break;
    //esta parte se usa para inyectar opc prederteminadas en el <select> del formulario modificar
    case "mod":
      $.ajax({
        url: "../../Controlador/Intermediarios/Carrera/ObtenerJefesCarrera.php",
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
          const select = $("#listaNombres");
          select.empty();

          let claveSeleccionada = "";

          if (!idJefeCarrera) {
            select.append(
              "<option disabled selected>Seleccione un nombre</option>"
            );
          }

          // se cargan las opc
          respuesta.forEach(function (jefe) {
            // como dato que aprendi alas malas si usas == tencuidado ya que este '5' == 5    true → hace conversión
            // y si usas === es para comparar de que si o si deven ser iguales '5' === 5  false → tipos distintos
            // y yo tenia == en deves de === por eso no funcionaba xd
            const esSeleccionado = jefe.clave === idJefeCarrera;

            if (esSeleccionado) {
              claveSeleccionada = jefe.clave;
            }
            select.append(`
                                <option value="${
                                  jefe.clave
                                }" data-id="${jefe.id}" data-clave="${jefe.clave}" ${esSeleccionado ? "selected" : ""}>
                                    ${jefe.nombre}
                                </option>
                            `);
          });

          $("#clavejefe").val(claveSeleccionada);
          console.log("Clave seleccionada:", claveSeleccionada || "[VACÍO]");

          select.off("change").on("change", function () {
            const nuevaClave =
              $(this).find("option:selected").data("clave") || "";
            $("#clavejefe").val(nuevaClave);
          });
        },
        error: function (xhr, status, error) {
          console.error("Error al cargar jefes:", status, error);
          mostrarErrorCaptura("Error al cargar nombres de jefes de carrera.");
        },
      });
      break;
  }
}

function changeStatusCarrera(id, status, currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado de la carrera <strong>${id}</strong> a <strong>${status}</strong>?</p>
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
      `select[onchange="changeStatusCarrera('${id}', this.value, '${currentStatus}')"]`
    );
    if (selectElement) {
      selectElement.value = currentStatus;
    }
  });

  // También resetear al cerrar el modal con la X o haciendo clic fuera
  modalElement.addEventListener("hidden.bs.modal", function () {
    const selectElement = document.querySelector(
      `select[onchange="changeStatusCarrera('${id}', this.value, '${currentStatus}')"]`
    );
    if (selectElement) {
      selectElement.value = currentStatus;
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

      console.log(`Cambiando estado de carrera ${id} a ${status}`);

      // Realizar petición AJAX para cambiar el estado
      $.ajax({
        url: "../../Controlador/Intermediarios/Carrera/CambiarEstadoCarrera.php",
        type: "POST",
        data: json,
        contentType: "application/json",
        timeout: 10000, // 10 segundos de timeout
        success: function (response) {
          try {
            if (typeof response === "string") {
              response = JSON.parse(response);
            }

            if (response.estado === "OK") {
              mostrarDatosGuardados(
                `El estado de la carrera ${id} ha sido cambiado a "${status}" correctamente.`,
                function () {
                  option("carrera", "");
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

/**
 * Funcion para guardar nueva carrera, toma los datos y los envia al intermediario correspondiente
 *
 * @function
 * @returns {boolean} Retorna `true` si los datos fueron enviados, o `false` si la validación falló.
 */
function guardarNuevaCarrera() {
  // Obtener y limpiar los valores de los campos del formulario
  const clave = document.getElementById("clavecarrera").value.trim();
  const nombre = document.getElementById("nombrecarrera").value.trim();
  const idJefe = document.getElementById("clavejefe").value.trim();
  // Validación: asegurar que ambos campos estén completos
  if (!clave || !nombre || !idJefe) {
    mostrarFaltaDatos("Por favor, llena todos los campos obligatorios.");
    return false;
  }
  // Construcción del objeto de datos a enviar
  const datos = {
    clave: clave,
    nombre: nombre,
    idJefe: idJefe,
  };
  // Convertir el objeto a JSON para el envío
  const json = JSON.stringify(datos);
  const url = "../../Controlador/Intermediarios/Carrera/AgregarCarrera.php";
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
            option("carrera", "");
          });
        } else if (
          respuesta.estado === "ERROR" &&
          respuesta.mensaje &&
          respuesta.mensaje
            .toLowerCase()
            .includes("clave de la carrera ya existe")
        ) {
          // ID duplicado: mensaje específico
          mostrarErrorCaptura(
            "La clave de la carrera ya existe. Por favor, usa otro."
          );
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
 * Función para verificar la clave de la carrera y si ya existe.
 */
function verificarClaveCarrera(clave, callback) {
  $.ajax({
    url: "../../Controlador/Intermediarios/Carrera/VerificarClaveC.php",
    type: "POST",
    data: JSON.stringify({ clave: clave }),
    contentType: "application/json",
    dataType: "json",
    success: function (respuesta) {
      if (respuesta.existe) {
        console.log("Respuesta del backend:", respuesta);
        callback(true); // la clave ya existe
      } else {
        callback(false); // no existe, se puede usar
      }
    },
    error: function () {
      console.error("Error al verificar la clave de la carrera.");
      callback(false);
    },
  });
}

/*
 * Función para buscar una Carrera por su ID.
 * Envía una solicitud POST al servidor y, si tiene éxito, llena el formulario con los datos recibidos.
 * Además, desactiva el campo de clave de carrera para evitar su edición.
 */
function BuscarCarrera(id) {
  let url = "../../Controlador/Intermediarios/Carrera/ModificarCarrera.php"; // Ruta al intermediario PHP

  let datos = { id: id, Buscar: true }; // Objeto con parámetros de búsqueda
  let json = JSON.stringify(datos); // Convertimos a formato JSON

  // Enviamos la solicitud POST
  $.post(
    url,
    json,
    function (response, status) {
      console.log("Respuesta del servidor:", response);
      console.log("Datos enviados:", json);

      // Validamos la respuesta del servidor
      if (status === "success" && response.estado === "OK" && response.datos) {
        console.log("Datos recibidos:", response.datos);

        // Rellenamos el formulario con los datos de la carrera
        document.getElementById("clavecarrera").value =
          response.datos.clave_de_carrera;
        document.getElementById("nombrecarrera").value =
          response.datos.nombre_de_carrera;
        document.getElementById("estado").value = response.datos.estado;

        cargarNombresEnSelect("mod", response.datos.clave_de_jefe);
      } else {
        // Si no se encontró la carrera, se muestra un mensaje
        sinres("Carrera no encontrada.");
      }
    },
    "json" // Especificamos que la respuesta esperada es JSON
  ).fail(function (xhr, status, error) {
    // Manejo de errores de conexión o servidor
    console.error("Error en la solicitud POST:", xhr.responseText);
    mostrarErrorCaptura("Error al buscar la Carrera.");
  });
}

/*
 * Función para modificar los datos de una Carrera existente.
 * Solo se permite cambiar el nombre y el jefe; la clave no puede cambiarse.
 */
function ModificarCarrera() {
  // Capturamos y limpiamos los datos del formulario
  const idC = document.getElementById("clavecarrera").value.trim();
  const nombreC = document.getElementById("nombrecarrera").value.trim();
  const idJ = document.getElementById("clavejefe").value.trim();

  // Validamos que todos los campos requeridos estén llenos
  if (!idC || !nombreC || !idJ) {
    mostrarFaltaDatos("Debe completar todos los campos obligatorios.");
    return;
  }

  // Construimos el objeto con los datos a enviar
  let datos = {
    claveCarrera: idC,
    nombre: nombreC,
    idJefe: idJ,
    Modificar: true,
  };

  let json = JSON.stringify(datos); // Convertimos a JSON
  let url = "../../Controlador/Intermediarios/Carrera/ModificarCarrera.php"; // URL del intermediario
  console.log("Datos JSON enviados:", json);

  // Enviamos la solicitud POST
  $.post(
    url,
    json,
    function (response, status) {
      // Si la modificación fue exitosa, mostramos mensaje de éxito
      if (response.success) {
        mostrarDatosGuardados(response.mensaje, "");
        option("carrera", ""); // Refrescamos o redirigimos según sea necesario
      } else {
        // Si hubo un error, lo mostramos al usuario
        mostrarErrorCaptura(response.mensaje);
      }
    },
    "json" // Indicamos que esperamos JSON como respuesta
  ).fail(function (xhr, status, error) {
    // Manejamos fallos de conexión o servidor
    console.error("Error en la solicitud POST:", xhr.responseText);
    mostrarErrorCaptura(
      "No se pudo conectar con el servidor. Inténtelo más tarde."
    );
  });
}
