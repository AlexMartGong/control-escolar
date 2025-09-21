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
        btnGuardarJ.disabled = true; // Deshabilitar el botón para evitar múltiples acciones
      }

      //verificar que el periodo seleccionado no este cerrado o cancelado
      else if (estado === "cerrado" || estado === "cancelado") {
        mostrarErrorCaptura(
          "Error: El periodo seleccionado está cerrado o cancelado."
        );
        btnGuardarJ.disabled = true; // Deshabilitar el botón para evitar múltiples acciones
      } else {
        // Si todo está bien, se puede proceder a enviar el formulario
        btnGuardarJ.disabled = true; // Deshabilitar el botón para evitar múltiples envíos
        //logica para guardar el parcial
        //guardarParcial();
        mostrarDatosGuardados("Parcial guardado correctamente.");
      }
      break;
    case "modificar":
      // Usar la validación específica para modificación
      if (validarFormularioModificacion()) {
        const btnModificar = document.getElementById("btnModificarJ");
        btnModificar.disabled = true; // Deshabilitar el botón para evitar múltiples envíos
        //logica para modificar el parcial
        //modificarParcial();
        mostrarDatosGuardados("Parcial modificado correctamente");
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
      const soloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/;
      if (estaVacio) {
        mostrarErrorparcial(input, "Este campo no puede estar vacío.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);
      }
      if (!soloLetras.test(valor)) {
        mostrarErrorparcial(input, "No se permiten caracteres especiales.", cont);
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

      if(estaVacio){
        mostrarErrorparcial(input, "Este campo no puede estar vacío.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);

      }

      if (!regexFecha.test(valor)){
        mostrarErrorparcial(input, "Formato invalido, intente de nuevo.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);
      }

      break;
      case "fechaFin":

       const regexFecha2 = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

      if(estaVacio){
        mostrarErrorparcial(input, "Este campo no puede estar vacío.", cont);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormularioParcial(idbtn);

      }

      if (!regexFecha2.test(valor)){
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
function validarFormularioModificacion() {
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
      `select[onchange="changeStatusOferta('${id}', this.value, '${currentStatus}')"]`
    );
    if (selectElement) {
      selectElement.value = currentStatus;
    }
  });

  // También resetear al cerrar el modal con la X o haciendo clic fuera
  modalElement.addEventListener("hidden.bs.modal", function () {
    const selectElement = document.querySelector(
      `select[onchange="changeStatusOferta('${id}', this.value, '${currentStatus}')"]`
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

      //En caso de que el estado no haya cambiado a cerrado o cancelado, el b

      // Preparar datos para enviar
      let data = {
        id: id,
        status: status,
      };

      // Convertir a JSON
      let json = JSON.stringify(data);
      //Muestra un mensaje de espera simulando el cambio de estado exitoso
      mostrarDatosGuardados(
        `El estado de  parcial ${id} ha sido cambiado a "${status}" correctamente.`,
        function () {
          option("parcial", "");
        }
      ); // Mensaje de espera

      /*

      // Realizar petición AJAX para cambiar el estado 
      $.ajax({
        url: "",
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
                `El estado de  parcial ${id} ha sido cambiado a "${status}" correctamente.`,
                function () {
                  option("parcial", "");
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
    }); */
    });
}

function iniciarFuncionesParcial(opc, id) {
  switch (opc) {
    case "frmParcial":
      obtenerDatosdePeriodoEnParcial();
      break;
    case "modParcial":
      cargarDatosParcial(1); // Simulando con ID 1, en implementación real usar el id pasado
    
    //obtenerDatosModParcial(id);

      break;
  }
}

// Función para cargar datos del parcial en el formulario de modificación
async function obtenerDatosModParcial(idParcial) {
  // Esta función debería hacer una petición fetch para obtener los datos del parcial
 /* try {
    const response = await fetch(`parcial/getParcial.php?id=${idParcial}`);
    if (!response.ok) {
      throw new Error("Error en la petición: " + response.statusText);
    }
    const datos = await response.json();
    mostrarDatosParcial(datos);
  } catch (error) {
    mostrarErrorCaptura(
      "Error al obtener los datos del parcial: " + error.message
    );
  }*/
}

function mostrarDatosParcial(datos) {
  // Aquí puedes mostrar los datos del parcial obtenidos en la peticion por fetch en el formulario de modificar parcial
}

//funcion para obtener los periodos por medio de una peticion fetch hacia un archivo php
async function obtenerDatosdePeriodoEnParcial(opc) {
  // obtiene los datos del periodo por medio de una peticion fetch
  // y se envia a la funcion mostrarDatosdePeriodoEnParcial
  /*try {
    const response = await fetch("parcial/getPeriodos.php");
    if (!response.ok) {
      throw new Error("Error en la petición: " + response.statusText);
    }
    const datos = await response.json();
    mostrarDatosdePeriodoEnParcial(datos);
  } catch (error) {
    mostrarErrorCaptura("Error al obtener los periodos: " + error.message);
  }*/
}

function mostrarDatosdePeriodoEnParcial(datos) {
  // Aquí puedes  mostrar los datos del periodo obtenidos en la peticion por fetch en el formulario de parcial
}
