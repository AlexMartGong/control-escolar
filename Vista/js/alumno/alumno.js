function loadFormAlumno(opc, id = "") {
  let url = "";
  if (opc === "frmalumno") {
    url = "alumno/frmAlumno.php";
  } else if (opc === "modalumno") {
    url = "alumno/modAlumno.php";
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

              if (opc === "frmalumno") {
                cargarCarrerasfrmAgr(); 
              }

              if (opc === "modalumno" && id !== "") {
                BuscarAlumno(id);
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

// Función principal de validación para formulario de alumno
function verificarInputAlumno(idetiqueta, idbtn) {
  let input = document.getElementById(idetiqueta);
  const valor = input.value.trim();
  const estaVacio = valor === "";
  const iconerror = document.querySelector(`#${idetiqueta}`);

  // Expresiones regulares para validaciones específicas
  const regexNoControl = /^[Cc]?[0-9]{8,10}$/; // Puede iniciar con C/c, seguido de 7-8 números
  const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/; // Solo letras y espacios
  const soloNumeros = /^[0-9]+$/; // Solo números

  const contenedor = input.closest(".mb-3");
  let errorPrevio = contenedor.querySelector(".errorscaracter");

  // Limpiar errores anteriores
  if (errorPrevio) {
    errorPrevio.remove();
    input.classList.remove("entrada-error");
    iconerror.classList.remove("is-invalid");
  }

  // Validaciones específicas por campo
  switch (idetiqueta) {
    case "noControl":
      if (estaVacio) {
        mostrarError(input, "El número de control no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
      } 
      else if (!regexNoControl.test(valor)) {
        mostrarError(
          input,
          'Formato incorrecto. Debe tener 8 caracteres máximo, puede iniciar con "C". Ej: C1234567'
        );
        iconerror.classList.add("is-invalid");
        input.classList.add("entrada-error");
      } 
      else {
        // Verificar si el número de control ya existe
        verificarNoControlAlumno(valor, function (existe) {
          if (existe) {
            claveExistenteAlumno(iconerror, input);
          } else {
            console.log("El número de control está disponible.");
          }
          evaluarFormularioAlumno(idbtn);
        });
        return; // Salir aquí para evitar la evaluación duplicada
      }
      break;

    case "nombreAlumno":
      if (estaVacio) {
        mostrarError(input, "El nombre no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
      } else if (!soloLetras.test(valor)) {
        mostrarError(
          input,
          "No se permiten números ni caracteres especiales. Solo letras y espacios."
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
      }
      break;

    case "grado":
      const gradoNum = parseInt(valor);
      if (estaVacio) {
        mostrarError(input, "El grado no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
      } else if (!soloNumeros.test(valor) || gradoNum < 1 || gradoNum > 12) {
        mostrarError(input, "El grado debe ser un número entre 1 y 12.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
      }
      break;

    case "periodosEnBaja":
      const periodosNum = parseInt(valor);
      if (
        valor !== "" &&
        (!soloNumeros.test(valor) || periodosNum < 0 || periodosNum > 3)
      ) {
        mostrarError(
          input,
          "Los períodos en baja deben ser un número entre 0 y 3."
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
      }
      break;

    default:
      // Para otros campos de texto
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.");
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
      }
      break;
  }

  evaluarFormularioAlumno(idbtn);
}

// Función para validar selects (grupo, género, turno)
function verificarSelectAlumno(idetiqueta, idbtn) {
  let select = document.getElementById(idetiqueta);
  const valor = select.value;
  const estaVacio = valor === "" || valor === null;

  const contenedor = select.closest(".mb-3");
  let errorPrevio = contenedor.querySelector(".errorscaracter");

  // Limpiar errores anteriores
  if (errorPrevio) {
    errorPrevio.remove();
    select.classList.remove("entrada-error");
    select.classList.remove("is-invalid");
  }

  // Validar si es campo obligatorio
  const camposObligatorios = ["grupo", "genero", "turno"];

  if (camposObligatorios.includes(idetiqueta) && estaVacio) {
    mostrarError(select, "Este campo es obligatorio.");
    select.classList.add("entrada-error");
    select.classList.add("is-invalid");
  }

  evaluarFormularioAlumno(idbtn);
}

// Función para evaluar todo el formulario
function evaluarFormularioAlumno(idbtn) {
  const btnGuardar = document.getElementById(idbtn);

  // Campos obligatorios
  const camposObligatorios = [
    "noControl",
    "nombreAlumno",
    "grado",
    "grupo",
    "genero",
    "turno",
  ];

  let formularioValido = true;

  // Verificar cada campo obligatorio
  camposObligatorios.forEach((campo) => {
    const elemento = document.getElementById(campo);
    if (!elemento) return;

    const valor = elemento.value.trim();
    const tieneError =
      elemento.classList.contains("entrada-error") ||
      elemento.classList.contains("is-invalid");

    if (valor === "" || tieneError) {
      formularioValido = false;
    }
  });

  // Verificar que se haya seleccionado una carrera
  const carrera = document.getElementById("listaCarrera");
  if (!carrera || carrera.value === "") {
    formularioValido = false;
  }

  // Habilitar/deshabilitar botón
  btnGuardar.disabled = !formularioValido;
}

function verificarNoControlAlumno(noControl, callback) {
  $.post(
    "../../Controlador/Intermediarios/Alumno/VerificarExistenciaNC.php",
    JSON.stringify({ noControl: noControl }),
    function (response) {
      // Validar si la respuesta ya es un objeto o aún es una cadena JSON
      let resultado = typeof response === "string" ? JSON.parse(response) : response;

      // Si 'existe' es true, entonces ya está registrado
      if (resultado.existe) {
        callback(true);  // Ya existe
      } else {
        callback(false); // No existe
      }
    }
  ).fail(function () {
    console.error("Error al verificar número de control");
    callback(false);
  });
}


function claveExistenteAlumno(iconerror, input) {
  mostrarError(input, "Este número de control ya está registrado.");
  input.classList.add("entrada-error");
  iconerror.classList.add("is-invalid");
}

function mostrarError(elemento, mensaje) {
  const contenedor = elemento.closest(".mb-3");
  const errorDiv = document.createElement("div");
  errorDiv.className = "errorscaracter text-danger mt-1";
  errorDiv.textContent = mensaje;
  contenedor.appendChild(errorDiv);
}

// Función que permite evaluar los campos antes de guardar un alumno
function validarCamposAlumno(mensaje, opc) {
  // Se obtienen los campos a evaluar
  let noControlElement = document.getElementById("noControl");
  let nombreElement = document.getElementById("nombreAlumno");
  let gradoElement = document.getElementById("grado");
  let grupoElement = document.getElementById("grupo");
  let generoElement = document.getElementById("genero");
  let turnoElement = document.getElementById("turno");
  let periodosElement = document.getElementById("periodosEnBaja");
  let carreraElement = document.getElementById("listaCarrera");

  // Expresiones regulares para validación
  let regexNoControl = /^[Cc]?[0-9]{8,10}$/; // Puede iniciar con C/c, seguido de 7-8-10 números
  let regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios
  let regexGrado = /^[1-9]$|^1[0-2]$/; // Números del 1 al 12
  let regexPeriodos = /^[0-3]$/; // Números del 0 al 3

  // Obtener los valores limpios de las entradas
  let noControl = noControlElement.value.trim();
  let nombreAlumno = nombreElement.value.trim();
  let grado = gradoElement.value.trim();
  let grupo = grupoElement.value.trim();
  let genero = generoElement.value.trim();
  let turno = turnoElement.value.trim();
  let periodosEnBaja = periodosElement.value.trim();
  let carrera = carreraElement.value.trim();

  switch (opc) {
    case "guardar":
      // Verificar campos vacíos
      if (
        noControl === "" ||
        nombreAlumno === "" ||
        grado === "" ||
        grupo === "" ||
        genero === "" ||
        turno === "" ||
        carrera === ""
      ) {
        // Marcar errores en campos vacíos
        marcarErrorAlumno(noControlElement, noControl);
        marcarErrorAlumno(nombreElement, nombreAlumno);
        marcarErrorAlumno(gradoElement, grado);
        marcarErrorAlumno(grupoElement, grupo);
        marcarErrorAlumno(generoElement, genero);
        marcarErrorAlumno(turnoElement, turno);
        marcarErrorAlumno(carreraElement, carrera);

        // Mostrar modal de error de captura de datos
        mostrarErrorCaptura(
          mensaje ||
            "No se pueden dejar campos vacíos. Verifique e intente de nuevo"
        );
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      // Validar formatos específicos
      if (!regexNoControl.test(noControl)) {
        mostrarErrorCaptura(
          "Número de control inválido. Formato correcto: C1234567 (8 caracteres máximo)"
        );
        noControlElement.classList.add("entrada-error");
        noControlElement.focus();
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      if (!regexNombre.test(nombreAlumno)) {
        mostrarErrorCaptura(
          "Nombre inválido. Solo se permiten letras y espacios"
        );
        nombreElement.classList.add("entrada-error");
        nombreElement.focus();
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      if (!regexGrado.test(grado)) {
        mostrarErrorCaptura("Grado inválido. Debe ser un número entre 1 y 12");
        gradoElement.classList.add("entrada-error");
        gradoElement.focus();
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      if (periodosEnBaja !== "" && !regexPeriodos.test(periodosEnBaja)) {
        mostrarErrorCaptura(
          "Períodos en baja inválido. Debe ser un número entre 0 y 3"
        );
        periodosElement.classList.add("entrada-error");
        periodosElement.focus();
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      // Si todo está bien, proceder a guardar
      deshabilitarBtnAlumno(true, "btnGuardar");
      intentarGuardarDatosAlumno("add");
      break;

    case "modificar":
      // Validaciones para el formulario de modificar
      if (
        noControl === "" ||
        nombreAlumno === "" ||
        grado === "" ||
        grupo === "" ||
        genero === "" ||
        turno === "" ||
        carrera === ""
      ) {
        // Marcar errores en campos vacíos
        marcarErrorAlumno(noControlElement, noControl);
        marcarErrorAlumno(nombreElement, nombreAlumno);
        marcarErrorAlumno(gradoElement, grado);
        marcarErrorAlumno(grupoElement, grupo);
        marcarErrorAlumno(generoElement, genero);
        marcarErrorAlumno(turnoElement, turno);
        marcarErrorAlumno(carreraElement, carrera);

        mostrarErrorCaptura(
          mensaje ||
            "No se pueden dejar campos vacíos. Verifique e intente de nuevo"
        );
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      if (!regexNombre.test(nombreAlumno)) {
        mostrarErrorCaptura(
          "Nombre inválido. Solo se permiten letras y espacios."
        );
        nombreElement.classList.add("entrada-error");
        nombreElement.focus();
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      // Validaciones adicionales para modificar...
      if (!regexGrado.test(grado)) {
        mostrarErrorCaptura("Grado inválido. Debe ser un número entre 1 y 12");
        gradoElement.classList.add("entrada-error");
        gradoElement.focus();
        deshabilitarBtnAlumno(true, "btnGuardar");
        return;
      }

      // Si todo está bien, proceder a modificar
      intentarGuardarDatosAlumno("mod");
      deshabilitarBtnAlumno(true, "btnGuardar");
      break;
  }
}

// Función auxiliar para marcar errores en campos
function marcarErrorAlumno(elemento, valor) {
  if (valor === "" || valor === null) {
    elemento.classList.add("entrada-error");
    elemento.classList.add("is-invalid");
  } else {
    elemento.classList.remove("entrada-error");
    elemento.classList.remove("is-invalid");
  }
}

// Función auxiliar para habilitar/deshabilitar botón
function deshabilitarBtnAlumno(estado, idBoton) {
  const boton = document.getElementById(idBoton);
  if (boton) {
    boton.disabled = estado;
  }
}

// Función que intenta guardar los datos del alumno
function intentarGuardarDatosAlumno(operacion) {
  try {
    if (operacion === "add") {
      AgregarAlumno();
    } else if (operacion === "mod") {
      ModificarAlumno(); 
    }
  } catch (error) {
    console.error("Error al intentar guardar:", error);
    mostrarErrorCaptura("Error inesperado al guardar los datos.");
    deshabilitarBtnAlumno(false, "btnGuardar"); // Reactivar botón en caso de error
  }
}

function changeStatusAlumno(id, status, currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado del alumno <strong>${id}</strong> a <strong>${status}</strong>?</p>
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
      `select[onchange="changeStatusAlumno('${id}', this.value, '${currentStatus}')"]`
    );
    if (selectElement) {
      selectElement.value = currentStatus;
    }
  });

  // También resetear al cerrar el modal con la X o haciendo clic fuera
  modalElement.addEventListener("hidden.bs.modal", function () {
    const selectElement = document.querySelector(
      `select[onchange="changeStatusAlumno('${id}', this.value, '${currentStatus}')"]`
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

      console.log(`Cambiando estado de alumno ${id} a ${status}`);

      // Realizar petición AJAX para cambiar el estado
      $.ajax({
        url: "../../Controlador/Intermediarios/Alumno/CambiarEstadoAlumno.php",
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
                `El estado de la oferta ${id} ha sido cambiado a "${status}" correctamente.`,
                function () {
                  option("student", "");
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
 */
function AgregarAlumno() {
  // Obtener y limpiar los valores de los campos del formulario
  const nc = document.getElementById("noControl").value.trim();
  const nombre = document.getElementById("nombreAlumno").value.trim();
  const genero = document.getElementById("genero").value.trim();
  const semestre = document.getElementById("grado").value.trim();
  const grupo = document.getElementById("grupo").value.trim();
  const turno = document.getElementById("turno").value.trim();
  const claveC = document.getElementById("claveCarrera").value.trim();

  // Validación: asegurar que ambos campos estén completos
  if (!nc || !nombre || !genero || !semestre || !grupo || !turno || !claveC) {
    mostrarFaltaDatos("Por favor, llena todos los campos obligatorios.");
  }

  // Construcción del objeto de datos a enviar
  const datos = {
    pnoControl: nc,
    pnombre: nombre,
    pgenero: genero,
    psemestre: semestre,
    pgrupo: grupo,
    pturno: turno,
    pclaveCarrera: claveC,
  };

  // Convertir el objeto a JSON para el envío
  const json = JSON.stringify(datos);
  const url = "../../Controlador/Intermediarios/Alumno/AgregarAlumno.php";
  console.log("Datos a enviarr:", json);

  // Enviamos la solicitud POST
  $.post(
    url,
    json,
    function (response, status) {
      // Si la modificación fue exitosa, mostramos mensaje de éxito
      if (response.estado === "OK") {
        mostrarDatosGuardados(response.mensaje, "");
        option("student", ""); // Refrescamos o redirigimos según sea necesario
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

/**
 * Carga la lista de carreras activas desde el servidor y las inserta en el <select> correspondiente.
 */
function cargarCarrerasfrmAgr() {
  fetch("../../Controlador/Intermediarios/Carrera/ObtenerCarrerasActivas.php")
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("listaCarrera");
      const inputClave = document.getElementById("claveCarrera");

      if (data.datos && data.datos.length > 0) {
        data.datos.forEach((carrera) => {
          const option = document.createElement("option");
          option.value = carrera.clave_de_carrera;
          option.textContent = carrera.nombre_de_carrera;
          select.appendChild(option);
        });
      }

      select.addEventListener("change", function () {
        inputClave.value = this.value;
      });
    })
    .catch((error) => {
      console.error("Error cargando Carreras:", error);
    });
}

/**
 * Busca un alumno en el servidor por su número de control (ID).
 *
 * Envía una solicitud POST al script PHP intermediario para obtener los datos del alumno.
 * Si la respuesta es exitosa, se llenan automáticamente los campos del formulario
 * con la información recibida y se actualiza la lista de carreras correspondiente.
 *
 * @param {string} id - Número de control del alumno a buscar.
 */
function BuscarAlumno(id) {
  let url = "../../Controlador/Intermediarios/Alumno/ModificarAlumno.php";
  let datos = { id: id, Buscar: true };
  let json = JSON.stringify(datos);

  console.log("[BuscarAlumno] Buscando alumno con ID:", id);

  // Realizar la solicitud POST al servidor
  $.post(
    url,
    json,
    function (response, status) {
      console.log("[BuscarAlumno] Respuesta recibida:", response);

      // Verificar si la respuesta fue exitosa y contiene datos
      if (status === "success" && response.estado === "OK" && response.datos) {
        const datos = response.datos;

        // Llenar los campos del formulario con los datos del alumno
        $("#noControl").val(datos.numero_de_control);
        $("#nombreAlumno").val(datos.nombre_de_alumno);
        $("#genero").val(datos.genero);
        $("#grado").val(datos.semestre);
        $("#grupo").val(datos.grupo);
        $("#periodosEnBaja").val(datos.periodos_en_baja);
        $("#estado").val(datos.estado);
        $("#turno").val(datos.turno);
        $("#claveCarrera").val(datos.clave_de_carrera);

        setTimeout(() => {
          cargarCarrerasfrmMod(datos.clave_de_carrera);
        }, 250);

      } else {
        // Mostrar mensaje de error si no se encontró el alumno
        mostrarErrorCaptura(
          response.mensaje || "No se encontró el alumno solicitado."
        );
      }
    },
    "json"
  ).fail(function (xhr, status, error) {
    // Manejo de errores de red o del servidor
    console.error(
      "[BuscarAlumno] Error en la solicitud POST:",
      xhr.responseText
    );
    mostrarErrorCaptura("No se pudo completar la búsqueda del alumno.");
  });
}

/**
 * Envía los datos del formulario para modificar los datos de un alumno existente.
 *
 * Valida que todos los campos requeridos estén completos antes de enviar la información.
 * Si la operación tiene éxito, muestra un mensaje de confirmación y actualiza la vista.
 */
function ModificarAlumno() {
  // Obtener y limpiar los valores ingresados en el formulario
  const nc = document.getElementById("noControl").value.trim();
  const nombre = document.getElementById("nombreAlumno").value.trim();
  const genero = document.getElementById("genero").value.trim();
  const semestre = document.getElementById("grado").value.trim();
  const grupo = document.getElementById("grupo").value.trim();
  const turno = document.getElementById("turno").value.trim();
  const claveC = document.getElementById("claveCarrera").value.trim();

  // Validar que todos los campos requeridos tengan un valor
  if (!nc || !nombre || !genero || !semestre || !grupo || !turno || !claveC) {
    mostrarFaltaDatos(
      "Por favor, complete todos los campos obligatorios para continuar."
    );
    return;
  }

  // Construir el objeto con los datos a enviar al servidor
  const datos = {
    noControl: nc,
    nombre: nombre,
    genero: genero,
    semestre: semestre,
    grupo: grupo,
    turno: turno,
    claveCarrera: claveC,
    Modificar: true,
  };

  const json = JSON.stringify(datos);
  const url = "../../Controlador/Intermediarios/Alumno/ModificarAlumno.php";

  // Mostrar en consola los datos enviados (útil para depuración)
  console.log("[ModificarAlumno] Enviando datos JSON:", json);

  // Enviar los datos mediante POST y procesar la respuesta del servidor
  $.post(
    url,
    json,
    function (response, status) {
      if (response.success) {
        mostrarDatosGuardados(response.mensaje, "");
        option("student", ""); // Recargar o actualizar la vista del estudiante
      } else {
        console.warn(
          "[ModificarAlumno] Error en respuesta del servidor:",
          response.mensaje
        );
        mostrarErrorCaptura(response.mensaje);
      }
    },
    "json"
  ).fail(function (xhr, status, error) {
    // Capturar errores de red o del servidor
    console.error(
      "[ModificarAlumno] Fallo en la solicitud POST:",
      xhr.responseText
    );
    mostrarErrorCaptura(
      "No se pudo conectar con el servidor. Inténtelo nuevamente más tarde."
    );
  });
}

/**
 * Carga la lista de carreras activas desde el servidor y las inserta en el <select> correspondiente.
 * Además, sincroniza el campo de texto con la clave de la carrera seleccionada.
 *
 */
function cargarCarrerasfrmMod(clave_de_carrera) {
  fetch("../../Controlador/Intermediarios/Carrera/ObtenerCarrerasActivas.php")
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("listaCarrera");
      const inputClave = document.getElementById("claveCarrera");

      if (!select) {
        console.error("No se encontró el select 'listaCarrera'");
        return;
      }

      select.innerHTML =
        '<option value="" disabled>Seleccione una Carrera</option>';

      if (data.datos && data.datos.length > 0) {
        data.datos.forEach((carrera) => {
          const option = document.createElement("option");
          option.value = carrera.clave_de_carrera;
          option.textContent = carrera.nombre_de_carrera;

          if (carrera.clave_de_carrera === clave_de_carrera) {
            option.selected = true;
            inputClave.value = carrera.clave_de_carrera;
          }

          select.appendChild(option);
        });
      }

      select.addEventListener("change", function () {
        inputClave.value = this.value;
      });
    })
    .catch((error) => {
      console.error("Error cargando Carreras:", error);
    });
}
