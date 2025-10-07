//Autor Miguel Angel Lara H.
//Autor
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.

NUEVAS FUNCIONALIDADES PARA MODIFICACIÓN:
- validarEstadoParcialParaEdicion: Valida si un parcial puede ser editado según su estado
- validarPeriodoParaModificacion: Solo permite periodos pendientes o activos en modificación
- verificarParcialesEnPeriodo: Verifica el conteo de parciales por periodo
- cargarDatosParcial: Carga los datos del parcial a modificar
- validarFormularioModificacion: Validación específica para modificación

VALIDACIONES IMPLEMENTADAS:
1. No permitir edición de parciales en estado "Cerrado" o "Cancelado"
2. Solo permitir selección de periodos "Pendiente" o "Activo" en modificación
3. Validar límite de 4 parciales por periodo al cambiar periodo
4. Campos de solo lectura: id_parcial, estado_parcial
5. Campos editables: nombre_parcial, periodo_Id

USO:
- Para abrir formulario de modificación: loadFormParcial("modParcial", idParcial)
- Las validaciones se ejecutan automáticamente en tiempo real
*/

function loadFormParcial(opc, id = "") {
  let url = "";
  if (opc === "frmParcial") {
    url = "parcial/frmParcial.php";
  } else if (opc === "modParcial") {
    url = "parcial/modParcial.php";
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
              iniciarFuncionesParcial(opc, id); // Iniciar funciones específicas para parcial
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

//funcion para validar antes de guardar que los datos sean los nesesarios.
function validarFormularioParcial(opc) {
  // Obtenemos los valores que el usuario ingreso por medio de las etiquetas
  const nombre_parcial = document.querySelector("#nombre_parcial");
  const idperiodo = document.querySelector("#idperiodo");
  const estado_parcial = document.querySelector("#periodo_Id");
  const fechaInicio = document.querySelector("#fechaInicio");
  const fechaFin = document.querySelector("#fechaFin");

  //se limpian los valores
  const nombre = nombre_parcial.value.trim();
  const periodo = idperiodo.value.trim();
  const fehcaI = fechaInicio.value.trim();
  const fechaf = fechaFin.value.trim();
  //se crea un arreglo con los campos a validar

  const campos = [
    [nombre_parcial, nombre],
    [idperiodo, periodo],
    [fechaInicio, fehcaI],
    [fechaFin, fechaf]
  ];

  const nadaVacio = campos.every(([_, valor]) => valor.trim() !== "");

  switch (opc) {
    case "guardar":
      const opcion = estado_parcial.options[estado_parcial.selectedIndex];
      const estado = opcion?.dataset?.estado || "";

      if (!nadaVacio) {
        campos.forEach(([elemento, valor]) => {
          marcarError(elemento, valor);
        });

        mostrarFaltaDatos(
          "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
        );
      } else if (verificarMaxParciales(periodo) === true) {
        mostrarErrorCaptura(
          "Error: El periodo seleccionado ya tiene el máximo de 4 parciales."
        );
        //btnGuardarJ.disabled = true; // Deshabilitar el botón para evitar múltiples acciones
      }

      //verificar que el periodo seleccionado no este cerrado o cancelado
      else if (estado === "cerrado" || estado === "cancelado") {
        mostrarErrorCaptura(
          "Error: El periodo seleccionado está cerrado o cancelado."
        );
        //btnGuardarJ.disabled = true; // Deshabilitar el botón para evitar múltiples acciones
      } else {
        guardarParcial().finally(() => { btnGuardarJ.disabled = true; });
      }
      break;
    case "modificar":
      // Usar la validación específica para modificación
      if (validarFormularioModificacionParcial()) {
        const btnModificar = document.getElementById("btnModificarJ");
        btnModificar.disabled = true; // Deshabilitar el botón para evitar múltiples envíos
        //logica para modificar el parcial
        modificarParcial();
      } else {
        // Los errores ya se muestran en validarFormularioModificacion
        campos.forEach(([elemento, valor]) => {
          if (!valor.trim()) {
            marcarError(elemento, valor);
          }
        });
      }
      break;
  }
}

// funcion que permite evaluar los campos correctamente mientras escribe en el input
function validarEntrdasParcial(idetiqueta, idbtn, idperiodo, cont) {
  let input = document.getElementById(idetiqueta);
  const periodoInfo = document.getElementById(idperiodo);
  const valor = input.value.trim();
  const estaVacio = valor === "";
  const iconerror = document.querySelector(`#${idetiqueta}`);
  const contenedor = input.closest("." + cont);

  // Detectar si estamos en modo modificación
  const esModificacion = document.getElementById("id_parcial") !== null;

  // Buscar mensaje de error por mensaje
  const errorMensaje = contenedor.querySelector(".errorscaracter");
  if (errorMensaje) {
    errorMensaje.remove();
    input.classList.remove("entrada-error");
  }

  // Buscar otros errores (is-invalid)
  const errorInvalid = contenedor.querySelector(".is-invalid");
  if (errorInvalid) {
    errorInvalid.classList.remove("is-invalid");
    input.classList.remove("entrada-error");
  }

  // Validaciones por tipo de campo
  switch (idetiqueta) {
    case "nombre_parcial":

      if (estaVacio) {
        mostrarErrorparcial(input, "Este campo no puede estar vacío.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);
      }
      break;

    case "periodo_Id":
      const opcion = input.options[input.selectedIndex];
      const estado = opcion ? opcion.dataset.estado : "";

      // Validaciones específicas para modificación
      if (esModificacion) {
        // En modificación solo permitir estados pendiente y activo/abierto
        if (estado && !validarPeriodoParaModificacion(estado)) {
          periodoInfo.textContent =
            "Solo se pueden seleccionar periodos pendientes o activos.";
          setEstadoPeriodo("Error");
          iconerror.classList.add("is-invalid");
          input.classList.add("entrada-error");
          return evaluarEstadoFormularioParcial(idbtn);
        }

        // Verificar límite de parciales solo si es un periodo diferente al original
        const periodoOriginal =
          document.getElementById("idperiodo").dataset.original || "";
        if (valor && valor !== periodoOriginal) {
          const conteoActual = verificarParcialesEnPeriodo(valor);
          if (conteoActual > 4) {
            periodoInfo.textContent =
              "Error: El periodo seleccionado ya tiene el máximo de 4 parciales.";
            setEstadoPeriodo("Error");
            iconerror.classList.add("is-invalid");
            input.classList.add("entrada-error");
            return evaluarEstadoFormularioParcial(idbtn);
          }
        }
      } else {
        // Validación original para agregar nuevo parcial
        if (verificarMaxParciales(valor) === true) {
          periodoInfo.textContent =
            "Error: El periodo seleccionado ya tiene el máximo de 4 parciales.";
          setEstadoPeriodo("error");
          iconerror.classList.add("is-invalid");
          input.classList.add("entrada-error");
          return evaluarEstadoFormularioParcial(idbtn);
        }
      }

      // Mostrar estado del periodo seleccionado
      if (estado === "Pendiente") {
        periodoInfo.textContent = "Periodo en estado pendiente";
        setEstadoPeriodo("Pendiente");
        return evaluarEstadoFormularioParcial(idbtn);
      }
      if (estado === "Abierto" || estado === "Activo") {
        periodoInfo.textContent = "Periodo en estado abierto";
        setEstadoPeriodo("Abierto");
        return evaluarEstadoFormularioParcial(idbtn);
      }
      if (estado === "Cerrado" || estado === "Cancelado") {
        periodoInfo.textContent = "Periodo en estado cerrado o cancelado";
        setEstadoPeriodo("Error");
        iconerror.classList.add("is-invalid");
        input.classList.add("entrada-error");
        return evaluarEstadoFormularioParcial(idbtn);
      }

      break;

    case "fechaInicio":
      const regexFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

      if (estaVacio) {
        mostrarErrorparcial(input, "Este campo no puede estar vacío.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);

      }

      if (!regexFecha.test(valor)) {
        mostrarErrorparcial(input, "Formato invalido, intente de nuevo.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);
      }

      break;
    case "fechaFin":

      const regexFecha2 = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

      if (estaVacio) {
        mostrarErrorparcial(input, "Este campo no puede estar vacío.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);

      }

      if (!regexFecha2.test(valor)) {
        mostrarErrorparcial(input, "Formato invalido, intente de nuevo.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);
      }

      break;


  }
  // Siempre reevalúa el estado global al final
  evaluarEstadoFormularioParcial(idbtn);
}

//Funcion que permite evaliar si esta todo correctamente para Habilitar el boton de guardar
function evaluarEstadoFormularioParcial(idbtn) {
  const nombreInput = document.getElementById("nombre_parcial");
  const periodoInput = document.getElementById("periodo_Id");
  const fehcaInicio = document.getElementById("fechaInicio");
  const fechaFin = document.getElementById("fechaFin")
  const btnGuardar = document.getElementById(idbtn);
  const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;


  let hayErrores = false;

  // Verificar clases
  const inputs = [nombreInput, periodoInput];
  if (
    inputs.some((input) =>
      input.classList.contains("entrada-error", "is-invalid")
    )
  ) {
    hayErrores = true;
  }

  // Verificar que las entrasa no contengan caracteres no permitidos
  if (!soloLetras.test(nombreInput.value.trim())) {
    hayErrores = true;
  }

  let camposVacios = [
    nombreInput.value.trim() === "",
    periodoInput.value.trim() === "",
    fehcaInicio.value.trim() === "",
    fechaFin.value.trim() === ""
  ].some(Boolean);

  // Habilitar o deshabilitar el botón de guardar
  btnGuardar.disabled = hayErrores || camposVacios;
}

function setEstadoPeriodo(estado) {
  const div = document.getElementById("periodoInfoclass");

  // Quita las clases de Bootstrap que no correspondan
  div.classList.remove(
    "alert-success",
    "alert-info",
    "alert-warning",
    "alert-danger"
  );

  switch (estado) {
    case "Abierto":
    case "Activo":
      div.classList.add("alert-success");
      break;
    case "Pendiente":
      div.classList.add("alert-warning");
      break;
    case "Error":
      div.classList.add("alert-danger");
      break;
    default:
      div.classList.add("alert-info");
      break;
  }
}

//funcion para mostrar el error de escritura
function mostrarErrorparcial(input, mensaje, cont) {
  const contenedorCampo = input.closest("." + cont);
  // Eliminamos mensaje anterior si ya existe
  const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
  if (errorPrevio) errorPrevio.remove();
  const alerta = document.createElement("p");
  alerta.textContent = mensaje;
  alerta.classList.add("errorscaracter");
  contenedorCampo.appendChild(alerta); // Insertamos debajo del input group
}
// Función para verificar el máximo de parciales permitidos (simulado aquí)
function verificarMaxParciales(idPeriodo) {
  let maxParciales = 4; // Límite máximo de parciales por periodo

  //arreglar para que tome el id del periodo seleccionado
  // Si no se proporciona un periodo, no se puede verificar
  if (!idPeriodo) {
    return false;
  }
  // Aquí se debería hacer una consulta real al servidor para obtener el conteo actual
  // Por ahora simulo que ya hay 4 parciales registrados en el periodo seleccionado
  let parcialesActualesEnPeriodo = 3; // Simulación
  return parcialesActualesEnPeriodo > maxParciales;
}

// Función para verificar el conteo de parciales en un periodo específico
function verificarParcialesEnPeriodo(periodoId) {
  // Esta función debería hacer una consulta real al servidor
  // Por ahora simulo el conteo
  const conteosPorPeriodo = {
    1: 2, // Periodo 1 tiene 2 parciales
    2: 1, // Periodo 2 tiene 1 parcial
    3: 4, // Periodo 3 tiene 4 parciales (máximo)
  };

  return conteosPorPeriodo[periodoId] || 0;
}

// Función para validar si un parcial puede ser editado según su estado
function validarEstadoParcialParaEdicion(estadoParcial) {
  const estadosNoEditables = ["cerrado", "cancelado"];
  return !estadosNoEditables.includes(estadoParcial.toLowerCase());
}

//Esta funcion deve eliminarce
// Función para cargar datos del parcial en el formulario de modificación
function cargarDatosParcial(idParcial) {
  // Esta función debería hacer una petición AJAX para obtener los datos del parcial
  // Por ahora simulo los datos para demostrar la funcionalidad

  // Simular datos del parcial (en implementación real vendría del servidor)
  const datosParcial = {
    id: idParcial,
    nombre: "Primer Parcial",
    periodo_id: "2",
    periodo_nombre: "Periodo 2",
    estado: "pendiente", // Estados posibles: pendiente, activo, cerrado, cancelado
  };

  // Verificar si el parcial puede ser editado
  if (!validarEstadoParcialParaEdicion(datosParcial.estado)) {
    mostrarErrorCaptura(
      "No se puede modificar un parcial en estado " + datosParcial.estado
    );
    // Deshabilitar todos los campos editables
    document.getElementById("nombre_parcial").disabled = true;
    document.getElementById("periodo_Id").disabled = true;
    document.getElementById("btnModificarJ").disabled = true;
    return false;
  }

  // Cargar los datos en el formulario
  document.getElementById("id_parcial").value = datosParcial.id;
  document.getElementById("nombre_parcial").value = datosParcial.nombre;
  document.getElementById("periodo_Id").value = datosParcial.periodo_id;
  document.getElementById("idperiodo").value = datosParcial.periodo_id;
  document.getElementById("estado_parcial").value = datosParcial.estado;

  // Actualizar la información del periodo
  const periodoSelect = document.getElementById("periodo_Id");
  const opcionSeleccionada = periodoSelect.options[periodoSelect.selectedIndex];
  if (opcionSeleccionada) {
    const estadoPeriodo = opcionSeleccionada.dataset.estado;
    document.getElementById(
      "periodoInfo"
    ).textContent = `Periodo ${datosParcial.periodo_nombre}`;
    setEstadoPeriodo(estadoPeriodo);
  }

  // Evaluar el estado inicial del formulario
  evaluarEstadoFormularioParcial("btnModificarJ");

  return true;
}

// Función específica para validar periodos en modificación (solo pendiente y activo)
function validarPeriodoParaModificacion(estadoPeriodo) {
  const estadosPermitidos = ["pendiente", "activo", "abierto"];
  return estadosPermitidos.includes(estadoPeriodo.toLowerCase());
}

// Función para validar el formulario de modificación específicamente
function validarFormularioModificacionParcial() {
  const nombre_parcial = document.querySelector("#nombre_parcial");
  const periodo_Id = document.querySelector("#periodo_Id");
  const estado_parcial = document.querySelector("#estado_parcial");

  const nombre = nombre_parcial.value.trim();
  const periodo = periodo_Id.value.trim();
  const estadoParcial = estado_parcial.value.trim();

  // Verificar que el parcial puede ser modificado
  if (!validarEstadoParcialParaEdicion(estadoParcial)) {
    mostrarErrorCaptura(
      "No se puede modificar un parcial en estado " + estadoParcial
    );
    return false;
  }

  // Validar campos vacíos
  if (!nombre || !periodo) {
    mostrarErrorCaptura(
      "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
    );
    return false;
  }

  // Validar que el periodo seleccionado sea válido para modificación
  const periodoSelect = document.getElementById("periodo_Id");
  const opcionSeleccionada = periodoSelect.options[periodoSelect.selectedIndex];
  if (opcionSeleccionada) {
    const estadoPeriodo = opcionSeleccionada.dataset.estado;
    if (!validarPeriodoParaModificacion(estadoPeriodo)) {
      mostrarErrorCaptura(
        "Solo se pueden seleccionar periodos en estado 'Pendiente' o 'Activo'"
      );
      return false;
    }
  }

  // Validar límite de parciales si se cambia de periodo
  const periodoOriginal =
    document.getElementById("idperiodo").dataset.original || "";
  if (periodo !== periodoOriginal) {
    const conteoActual = verificarParcialesEnPeriodo(periodo);
    if (conteoActual >= 4) {
      mostrarErrorCaptura(
        "El periodo seleccionado ya tiene el máximo de 4 parciales permitidos"
      );
      return false;
    }
  }

  return true;
}

// Función para cambiar el estado de un parcial con confirmación modal
// Esta función se llama desde el onchange del select de estado
function changeStatusParcial(id, status, currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado de parcial con el ID <strong>${id}</strong> a <strong>${status}</strong>?</p>
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
      `select[onchange="changeStatusParcial('${id}', this.value, '${currentStatus}')"]`
    );
    if (selectElement) {
      selectElement.value = currentStatus;
    }
  });

  // También resetear al cerrar el modal con la X o haciendo clic fuera
  modalElement.addEventListener("hidden.bs.modal", function () {
    // Solo revertir si NO se confirmó
    if (!confirmed) {
      const selectElement = document.querySelector(
        `select[onchange="changeStatusParcial('${id}', this.value, '${currentStatus}')"]`
      );
      if (selectElement) selectElement.value = currentStatus;
    }
    modalElement.remove();
  });

  // Configurar acción para el botón confirmar
  let confirmed = false;

  document.getElementById("btnConfirmar").addEventListener("click", function () {
    confirmed = true;
    modal.hide();

    //En caso de que el estado no haya cambiado a cerrado o cancelado, el b

    // Preparar datos para enviar
    let data = {
      id: id,
      status: status,
    };

    // Convertir a JSON
    let json = JSON.stringify(data);
    //Muestra un mensaje de espera simulando el cambio de estado exitoso
    /*mostrarDatosGuardados(
      `El estado de  parcial ${id} ha sido cambiado a "${status}" correctamente.`,
      function () {
        option("parcial", "");
      }
    ); // Mensaje de espera
    */


    // Realizar petición AJAX para cambiar el estado 
    $.ajax({
      url: "../../Controlador/Intermediarios/Parcial/CambiarEstadoParcial.php",
      type: "POST",
      data: JSON.stringify({ id, status }),
      contentType: "application/json",
      dataType: "json",
      processData: false,
      timeout: 10000,
      success: function (response) {
        try {
          if (response?.estado === "OK") {
            mostrarDatosGuardados(
              `El estado de parcial ${id} ha sido cambiado a "${status}" correctamente.`,
              () => option("parcial", "")
            );
          } else {
            mostrarErrorCaptura(response?.mensaje || "Error al cambiar el estado.");
          }
        } catch (e) {
          mostrarErrorCaptura("Error procesando la respuesta: " + e.message);
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


async function iniciarFuncionesParcial(opc, id) {
    switch (opc) {
        case "frmParcial":
            await obtenerDatosdePeriodoEnParcial();
            break;
        case "modParcial":
            // Wait for periods to load before getting partial data
            await obtenerDatosdePeriodoEnParcial();
            // Small delay to ensure DOM updates
            await new Promise(resolve => setTimeout(resolve, 100));
            // Now get partial data
            await obtenerDatosModParcial(id);
            break;
    }
}

/**
 * Realiza una petición al servidor para obtener los datos de un parcial específico por su ID.
 * - Envía un JSON con la propiedad `pId` y `Buscar` al intermediario PHP.
 * - Procesa la respuesta y, si es exitosa, llama a `mostrarDatosParcial` para llenar el formulario.
 * - Muestra errores de red o de servidor en caso de fallo.
 * 
 * @param {number|string} idParcial - ID del parcial que se desea consultar.
 */
async function obtenerDatosModParcial(idParcial) {
  let url = "../../Controlador/Intermediarios/Parcial/ModificarParcial.php";
  let datos = { pId: idParcial, Buscar: true };
  let json = JSON.stringify(datos);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });

    if (!response.ok) {
      throw new Error("Error en la petición: " + response.statusText);
    }

    const resultado = await response.json();

    if (resultado.estado === "OK") {
      // Llenar el formulario con los datos recibidos
      mostrarDatosParcial(resultado.datos);
    } else {
      // Mostrar el mensaje de error que viene desde PHP
      mostrarErrorCaptura(resultado.mensaje);
    }
  } catch (error) {
    mostrarErrorCaptura(
      "Error al obtener los datos del parcial: " + error.message
    );
  }
}

/**
 * Llena los campos del formulario de modificación de parcial con los datos recibidos.
 * - Asigna el ID del parcial al input correspondiente.
 * - Selecciona el nombre del parcial en el select.
 * - Selecciona el periodo correspondiente en el select y dispara el evento 'change'
 *   para actualizar campos dependientes (como `#periodoInfo`).
 * - Rellena las fechas de inicio y término del parcial.
 * - Muestra el estado actual del parcial en el campo de solo lectura.
 * 
 * @param {Object} datos - Objeto con la información del parcial obtenida desde la base de datos.
 * @param {string|number} datos.clave_parcial - ID del parcial.
 * @param {string} datos.nombre_parcial - Nombre del parcial ('Primero', 'Segundo', etc.).
 * @param {string|number} datos.clave_periodo - ID del periodo al que pertenece el parcial.
 * @param {string} datos.fecha_inicio_de_parcial - Fecha de inicio del parcial.
 * @param {string} datos.fecha_termino_de_parcial - Fecha de término del parcial.
 * @param {string} datos.estado - Estado actual del parcial ('Abierto', 'Cerrado', etc.).
 */
function mostrarDatosParcial(datos) {
  // ID del parcial
  $("#id_parcial").val(datos.clave_parcial);

  // Nombre del parcial (select)
  $("#nombre_parcial").val(datos.nombre_parcial);

  // Nombre del periodo (select)
  $("#periodo_Id").val(datos.clave_periodo).trigger("change");

  // Id del periodo 
  $("#idperiodo").val(datos.clave_periodo);

  // Fechas
  $("#fechaInicio").val(datos.fecha_inicio_de_parcial);
  $("#fechaFin").val(datos.fecha_termino_de_parcial);

  // Estado del parcial 
  $("#estado_parcial").val(datos.estado);
}

/**
 * Realiza la actualización de un parcial existente en la base de datos.
 * - Recopila los valores ingresados en el formulario de modificación.
 * - Envía un JSON con todos los datos necesarios al intermediario PHP para procesar la actualización.
 * - Si la operación es exitosa, llama a `mostrarDatosGuardados` para notificar al usuario.
 * - Maneja errores de red, validaciones o fallos del servidor y los muestra mediante `mostrarErrorCaptura`.
 */
async function modificarParcial() {

  const idPa = document.getElementById("id_parcial").value.trim();
  const nombrePa = document.getElementById("nombre_parcial").value.trim();
  const idPe = document.getElementById("idperiodo").value.trim();
  const fechaI = document.getElementById("fechaInicio").value.trim();
  const fechaT = document.getElementById("fechaFin").value.trim();

  const datos = {
    pId: idPa,
    pnombre: nombrePa,
    pIdPeriodo: idPe,
    pfchInicio: fechaI,
    pfchTermino: fechaT,
    Modificar: true
  };

  const json = JSON.stringify(datos);
  const url = "../../Controlador/Intermediarios/Parcial/ModificarParcial.php";

  //console.log("Datos JSON enviados:", json);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });

    if (!response.ok) {
      throw new Error("Error en la petición: " + response.statusText);
    }

    const resultado = await response.json();

    if (resultado.estado === "OK") {
      mostrarDatosGuardados(resultado.mensaje);
      option("parcial", "");
    } else {
      mostrarErrorCaptura(resultado.mensaje);
    }
  } catch (error) {
    mostrarErrorCaptura(
      "Error al modificar los datos del parcial: " + error.message
    );
  }

}

/**
 * Hace petición al servidor para obtener los periodos disponibles
 * y carga el combo <select> con los datos recibidos.
 * - Intenta parsear JSON aunque venga con ruido extra.
 * - Muestra errores si la respuesta es inválida.
 */
async function obtenerDatosdePeriodoEnParcial() {
  try {
    const resp = await fetch("../../Controlador/Intermediarios/Parcial/ObtenerPeriodosDisponibles.php", { credentials: "include" });
    const raw = await resp.text();
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      const end = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"));
      payload = end >= 0 ? JSON.parse(raw.slice(0, end + 1)) : null; // <-- ahora sí parsea
      console.warn("Respuesta con basura extra; se recortó.", e);
    }
    if (!payload) throw new Error("Respuesta inválida del servidor");
    mostrarDatosdePeriodoEnParcial(payload);
  } catch (err) {
    mostrarErrorCaptura?.("Error al obtener los periodos: " + err.message);
  }
}

/**
 * Recibe la respuesta de periodos y los renderiza en el <select>.
 * - Valida que payload.estado sea "OK".
 * - Llena el <select id="periodo_Id"> con opciones de periodos.
 * - Dispara el evento "change" al final.
 */
function mostrarDatosdePeriodoEnParcial(payload) {
  if (!payload || payload.estado !== "OK") {
    mostrarErrorCaptura?.(payload?.mensaje || "No se pudieron obtener periodos.");
    return;
  }

  const periodos = Array.isArray(payload.datos) ? payload.datos : [];
  const select = document.getElementById("periodo_Id");
  if (!select) return;

  select.innerHTML = '<option value="" disabled selected>Seleccione un periodo</option>';

  for (const p of periodos) {
    const option = document.createElement("option");
    option.value = p.clave_periodo ?? "";
    option.textContent = p.periodo ?? "Periodo";
    if (p.estado) option.dataset.estado = p.estado;
    select.appendChild(option);
  }

  select.dispatchEvent(new Event("change"));
}

$(document).on('ajaxComplete DOMContentLoaded', function () {
  const sel = document.getElementById('periodo_Id');
  if (sel && sel.value) onPeriodoChange();
});

window.ParcialCtx = { parciales: [], periodo: null };

function _parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function _diffDays(a, b) { return Math.floor((_parseDate(b) - _parseDate(a)) / (1000 * 60 * 60 * 24)); }
function _overlaps(a1, b1, a2, b2) {  // rangos inclusivos
  return _parseDate(a1) <= _parseDate(b2) && _parseDate(b1) >= _parseDate(a2);
}

function _fi(p) { return p.fechaInicio || p.fecha_inicio_de_parcial; }
function _ft(p) { return p.fechaTermino || p.fecha_termino_de_parcial; }


/**
 * Devuelve el estado actual (activo, cerrado, etc.)
 * del periodo seleccionado en el combo.
 * @returns {string} Estado en minúsculas o '' si no hay selección.
 */
function estadoPeriodoActual() {
  const sel = document.getElementById('periodo_Id');
  if (!sel) return '';
  const opt = sel.options[sel.selectedIndex];
  return (opt?.dataset?.estado || '').toLowerCase();
}


/**
 * Handler cuando cambia el periodo seleccionado.
 * - Hace POST a ContextoParcial.php para traer contexto.
 * - Valida número máximo de parciales (≤ 4).
 * - Configura inputs de fechas y botón Guardar según reglas.
 * - Guarda contexto en ParcialCtx.
 */
async function onPeriodoChange() {
  const sel = document.getElementById('periodo_Id');
  const idPeriodo = Number(sel?.value) || 0;
  if (!idPeriodo) return;

  const el = document.getElementById('idperiodo');
  if (el) el.value = idPeriodo;


  const btn = document.getElementById('btnGuardarJ');
  const ini = document.getElementById('fechaInicio');
  const fin = document.getElementById('fechaFin');
  const info = document.getElementById('periodoInfo');

  try {
    const resp = await fetch('../../Controlador/Intermediarios/Parcial/ContextoParcial.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idPeriodo }),
      credentials: 'include'
    });
    const ctx = await resp.json();
    if (ctx.estado !== 'OK') {
      (window.mostrarErrorCaptura || alert)(ctx.mensaje || 'No se pudo obtener contexto');
      return;
    }

    // Guarda contexto para validar traslapes
    ParcialCtx.parciales = Array.isArray(ctx.parciales) ? ctx.parciales : [];
    ParcialCtx.periodo = ctx.periodo || null;

    // Máximo 4
    if (ctx.parcialesRegistrados > 4) {
      btn && (btn.disabled = true);
      if (ini) { ini.value = ''; ini.disabled = true; }
      if (fin) { fin.value = ''; fin.disabled = true; }
      if (info) info.textContent = `Parciales: ${ctx.parcialesRegistrados}/4 • ${ctx.periodo.inicio} → ${ctx.periodo.fin}`;
      (window.mostrarErrorCaptura || alert)('No se pueden registrar más de 4 parciales para este periodo');
      return;
    } else {
      btn && (btn.disabled = false);
      if (ini) ini.disabled = false;
      if (fin) fin.disabled = false;

    }

    if (info) info.textContent = `${ctx.periodo.inicio} → ${ctx.periodo.fin}`;

  } catch (e) {
    console.error(e);
    (window.mostrarErrorCaptura || alert)('Error de red al cargar el contexto del periodo');
  }
}

/**
 * Valida que las fechas inicio y término sean coherentes:
 * - inicio ≤ término
 * - dentro de los límites del periodo
 * - sin traslapes con parciales existentes
 * @returns {boolean} true si son válidas, false en caso contrario.
 */
function validarFechas() {
  const iniEl = document.getElementById('fechaInicio');
  const finEl = document.getElementById('fechaFin');
  if (!iniEl || !finEl) return true;

  const ini = iniEl.value;
  const fin = finEl.value;

  if (ini) finEl.min = ini;

  if (ini && fin && ini > fin) {
    (window.mostrarErrorCaptura || alert)('La fecha de inicio no puede ser mayor a la de término.');
    return false;
  }
  if (ini && iniEl.min && ini < iniEl.min) {
    (window.mostrarErrorCaptura || alert)(`Inicio debe ser ≥ ${iniEl.min}`);
    return false;
  }
  if (fin && finEl.max && fin > finEl.max) {
    (window.mostrarErrorCaptura || alert)(`Término debe ser ≤ ${finEl.max}`);
    return false;
  }
  //Valida que la fecha de inicio y final esten dentro del rango de fechas de periodo
  if (ParcialCtx.periodo) {
    const pIni = ParcialCtx.periodo.inicio;
    const pFin = ParcialCtx.periodo.fin;
    if (ini && pIni && ini < pIni) {
      (window.mostrarErrorCaptura || alert)(`Inicio debe ser ≥ ${pIni}`);
      return false;
    }
    if (fin && pFin && fin > pFin) {
      (window.mostrarErrorCaptura || alert)(`Término debe ser ≤ ${pFin}`);
      return false;
    }
  }
  //Valida que la fecha  de inicio y final de un nuevo parcial no caigan en el rango de otro parcial
  if (ini && fin && Array.isArray(ParcialCtx.parciales) && ParcialCtx.parciales.length) {
    for (const p of ParcialCtx.parciales) {
      const eIni = _fi(p), eFin = _ft(p);
      if (!eIni || !eFin) continue;
      if (_overlaps(ini, fin, eIni, eFin)) {
        (window.mostrarErrorCaptura || alert)(
          `El rango ${ini} → ${fin} se traslapa con ${eIni} → ${eFin}.`
        );
        return false;
      }
    }
  }

  //Validar que la fecha inicio de un parcial no sea menor a la fecha fin del ultimo parcial agregado
  if (ini && ParcialCtx.parciales.length) {
    const ultimo = ParcialCtx.parciales[ParcialCtx.parciales.length - 1];
    const finUltimo = _ft(ultimo);

    if (finUltimo && ini < finUltimo) {
      (window.mostrarErrorCaptura || alert)(
        `La fecha de inicio (${ini}) no puede ser menor que la fecha de término del último parcial (${finUltimo}).`
      );
      return false;
    }
  }


  return true;
}

/*
*Funcion para validar la secuncia de guardado y que tenga coherencia
*/
function validarSecuenciaParcial(nombreParcial) {
  const count = ParcialCtx.parciales.length;

  if (nombreParcial === "Segundo" && count < 1) {
    (window.mostrarErrorCaptura || alert)(
      "No puede registrar el Segundo Parcial si no existe el Primero."
    );
    return false;
  }
  if (nombreParcial === "Tercero" && count < 2) {
    (window.mostrarErrorCaptura || alert)(
      "No puede registrar el Tercer Parcial si no existe el Segundo."
    );
    return false;
  }
  if (nombreParcial === "Final" && count < 3) {
    (window.mostrarErrorCaptura || alert)(
      "No puede registrar el Parcial Final si no existen los anteriores."
    );
    return false;
  }

  return true;
}


/* ===== Listeners delegados (dejar al final del archivo) ===== */
$(document).on('change', '#periodo_Id', onPeriodoChange);


/**
 * Verifica que la duración del parcial sea al menos 35 días.
 * @returns {boolean} true si cumple, false y muestra error si no.
 */
function validar15ParaGuardar() {
  const ini = document.getElementById('fechaInicio')?.value || '';
  const fin = document.getElementById('fechaFin')?.value || '';
  if (!ini || !fin) return (window.mostrarErrorCaptura || alert)('Seleccione ambas fechas.'), false;
  if (_diffDays(ini, fin) < 15) {
    (window.mostrarErrorCaptura || alert)('La duración mínima del parcial es de 15 días.');
    return false;
  }
  return true;
}

/**
 * Envía los datos del nuevo parcial al backend para guardarlo.
 * - Previo valida rango de fechas (mínimo 15 días).
 * - Previo valida  fechas en general.
 * - Deshabilita el botón mientras guarda.
 * - Muestra mensaje según respuesta del servidor.
 */
async function guardarParcial() {
  const nombre = document.getElementById('nombre_parcial').value.trim();
  if (!validarSecuenciaParcial(nombre)) return;
  if (!validarFechas()) return;
  if (!validar15ParaGuardar()) return;

  const btn = document.getElementById('btnGuardarJ');
  btn && (btn.disabled = true);

  const body = {
    nombre: document.getElementById('nombre_parcial').value.trim(),
    inicio: document.getElementById('fechaInicio').value,
    termino: document.getElementById('fechaFin').value,
    idPeriodo: Number(document.getElementById('idperiodo').value)
  };

  try {
    const r = await fetch('../../Controlador/Intermediarios/Parcial/InsertarParcial.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include'
    });
    const j = await r.json();

    if (j.estado === 'OK') {
      (window.toastOk || window.mostrarDatosGuardados || alert)(j.mensaje || 'Parcial guardado.');
      resetFormularioParcial();
      onPeriodoChange();
      return;
    }
    (window.mostrarErrorCaptura || alert)(j.mensaje || 'No se pudo guardar.');
  } catch (err) {
    (window.mostrarErrorCaptura || alert)(`Error al guardar: ${err.message || err}`);
  } finally {
    btn && (btn.disabled = false);
  }
}

function resetFormularioParcial() {
  const sel = document.getElementById('nombre_parcial');
  const ini = document.getElementById('fechaInicio');
  const fin = document.getElementById('fechaFin');

  if (sel) {
    sel.selectedIndex = 0;
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }

  if (ini) {
    ini.value = '';
    ini.removeAttribute('min');
    ini.removeAttribute('max');
    ini.classList.remove('is-invalid', 'entrada-error');
  }
  if (fin) {
    fin.value = '';
    fin.removeAttribute('min');
    fin.removeAttribute('max');
    fin.classList.remove('is-invalid', 'entrada-error');
  }

  document.querySelectorAll('.errorscaracter').forEach(n => n.remove());

  if (typeof evaluarEstadoFormularioParcial === 'function') {
    evaluarEstadoFormularioParcial('btnGuardarJ');
  }

  sel?.focus();
}


// Cuando el usuario selecciona fechaInicio, autocompleta fechaFin +15 días
document.addEventListener("change", function (e) {
  if (e.target && e.target.id === "fechaInicio") {
    const iniEl = document.getElementById("fechaInicio");
    const finEl = document.getElementById("fechaFin");
    if (!iniEl || !finEl) return;

    const ini = iniEl.value;
    if (!ini) return;

    const fecha = new Date(ini);
    fecha.setDate(fecha.getDate() + 16);
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const dd = String(fecha.getDate()).padStart(2, "0");

    finEl.value = `${yyyy}-${mm}-${dd}`;
    finEl.min = ini;
  }
});



