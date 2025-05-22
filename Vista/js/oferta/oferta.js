//Autor Miguel Angel Lara H.
//Autor
//descripcion de funcionamiento
/*
Aqui se cargan los formularios de agregar y modificar, ademas se generan las validacions correspondientes
como validar campos vacion, que esten escritos correctamente y que sean igual que las validaciones se piden
tambien se inyecta codigo html y clases de css desde este archivo.
Calquier duda consultar con el autor
*/
// Esta funcion que permite cargar los formularios de agregar Docente y modificarlo, no desde function.js
function loadFormOferta(opc, id = "") {
  let url = "";
  if (opc === "frmOferta") {
    url = "oferta/frmOferta.php";
  } else if (opc === "modOferta") {
    url = "oferta/modOferta.php";
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

              if (opc === "modOferta" && id !== "") {
                BuscarOferta(id);
              } else {
                console.warn(
                  "NO se llama BuscarOferta. Condición no cumplida."
                );
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

//funcion para validar antes de guardar que los datos sean los nesesarios.
function validarfrmOferta(opc) {
  // Obtenemos los valores que el usuario ingreso por medio de las etiquetas
  const idOferta = document.querySelector("#idOferta");
  const idsemestre = document.querySelector("#idSemestre");
  const idGrupo = document.querySelector("#idGrupo");
  const claveCarrera = document.querySelector("#claveCarrera");
  const claveMateria = document.querySelector("#claveMateria");
  const claveDocente = document.querySelector("#claveDocente");
  const idturno = document.querySelector("#turno");
  const idestado = document.querySelector("#IdPeriod");

  //se limpian los valores
  const oferta = idOferta.value.trim();
  const semestre = idsemestre.value.trim();
  const grupo = idGrupo.value.trim();
  const carrera = claveCarrera.value.trim();
  const materia = claveMateria.value.trim();
  const docente = claveDocente.value.trim();
  const turno = idturno.value;
  const idPeriodo = idestado.value.trim();

  const noNegativos = semestre >= 1 && semestre <= 12;

  const campos = [
    [idOferta, oferta],
    [idsemestre, semestre],
    [idGrupo, grupo],
    [claveCarrera, carrera],
    [claveMateria, materia],
    [claveDocente, docente],
  ];

  const nadaVacio = campos.every(([_, valor]) => valor.trim() !== "");

  switch (opc) {
    case "agregar":
      if (!nadaVacio || !noNegativos) {
        campos.forEach(([elemento, valor]) => {
          marcarError(elemento, valor);
        });

        if (!noNegativos) {
          marcarError(idsemestre, "");
          mostrarErrorCaptura(
            "El semestre debe ser un número mayor o igual a 1 Y menor o igual a 12"
          );
        } else {
          mostrarErrorCaptura(
            "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
          );
          marcarError(idsemestre, "1");
        }
        if (turno === "Seleccione un turno") {
          const valor = "";
          marcarError(idturno, valor);
        } else {
          marcarError(idturno, turno);
        }
        if (idPeriodo === "") {
          const valor = "";
          marcarError(idestado, valor);
        } else {
          marcarError(idestado, idPeriodo);
        }
      } else {
        limpiarErrores("entrada-error", "is-invalid");
        if (
          existeOfertaEnTabla(
            semestre,
            grupo,
            turno,
            carrera,
            docente,
            idPeriodo,
            materia
          )
        ) {
          // en caso de que oferta exista se manda a llamar al modal
          ErrorDeIntentoDeGuardado(
            "Advertencia. Ya quexiste un periodo con los mimos parametros"
          );
        } else {
          //si no existe valores repetidos entonces ahora se agregar a la tabla
          agregarOfertaTabla();
          cargarIdOferta();
        }

        deshabilitarboton(true, "btnAgregarOferta");
      }

      break;
    // validaciones antes de aguardar en modificar
    case "modificar":
      if (!nadaVacio || !noNegativos) {
        campos.forEach(([elemento, valor]) => {
          marcarError(elemento, valor);
        });

        if (!noNegativos) {
          marcarError(idsemestre, "");
          mostrarErrorCaptura(
            "El semestre debe ser un número mayor o igual a 1 Y menor o igual a 12"
          );
        } else {
          mostrarErrorCaptura(
            "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
          );
          marcarError(idsemestre, "1");
        }
        if (turno === "Seleccione un turno") {
          const valor = "";
          marcarError(idturno, valor);
        } else {
          marcarError(idturno, turno);
        }
        if (idPeriodo === "") {
          const valor = "";
          marcarError(idestado, valor);
        } else {
          marcarError(idestado, idPeriodo);
        }
      } else {
        limpiarErrores("entrada-error", "is-invalid");
        intentarGuardarDatosOferta("mod");
        deshabilitarbtnCarrera(true, "btnGuardarJ");
      }

      break;
  }
}

// funcion que permite el control de guadado o modificado
function intentarGuardarDatosOferta(opc) {
  try {
    //Aqui se cargan las funciones que permiten guardar o modificar los datos
    if (opc === "add") {
      //aqui se genera la funcion para validar si la oferta ya existe retorna un true o false
      // si todo esta bien se realiza la funcion para aguardar la oferta y se limpia el formulario
      guardarNuevaOferta(); // esta se cambia por la funcion que se nesesita para guardar
      deshabilitarboton(true, "btnGuardarJ");
      limpiarTablaall();
    }
    // si el caso es de modifcacion aqui se manda a llamar la funcion para modificar.
    else if (opc === "mod") {
      
      ModificarOferta();

    }
  } catch (error) {
    // en caso de una falla se deabilita el boton y se muestra el modal con el problema
    ErrorDeIntentoDeGuardado("Error al intentar Guardar los datos");
    deshabilitarbtnCarrera(true, "btnGuardarJ");
  }
}

function verificarEntradasOferta(idetiqueta, idbtn, contenido) {
  // funcion que permite evaluar los campos que esten correctamente mientras el usuario escribe
  let input = document.getElementById(idetiqueta);
  const valor = input.value.trim();
  const estaVacio = valor === "";
  const iconerror = document.querySelector(`#${idetiqueta}`);
  const contenedor = input.closest(`.${contenido}`);
  const errorPrevio = contenedor.querySelector(".errorscaracter");
  //contantes que ayudaran a tener un mejor control de validaciones
  let regex = /^[A-Z]{4}-\d{4}-\d{3}$/; //aqui espesificamos que como de ver el formato de la claveCarrera
  const regexClavec = /^[A-Z]{3}-\d{4}$/; // formato clave materia y docente son iguales

  const soloLetras = /^[a-zA-Z]+$/;
  const patronNumerico = /^[0-9]+$/;

  if (errorPrevio) {
    errorPrevio.remove();
    input.classList.remove("entrada-error");
    iconerror.classList.remove("is-invalid");
  }

  // Validaciones por tipo de campo
  switch (idetiqueta) {
    case "idSemestre":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (valor <= 0 || valor > 12) {
        mostrarError(
          input,
          "solo se permite de mayor o igual a 1 y menor o igual a 12.",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!patronNumerico) {
        mostrarError(
          input,
          "Este campo solo puede contemer numeros.",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;

    case "idGrupo":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!soloLetras.test(valor)) {
        mostrarError(
          input,
          "Este campo solo puede contener una letra.",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }

      break;

    case "turno":
      if (valor === "Seleccione un turno") {
        const valor = "";
        mostrarError(input, "Selecciona una opcion.", contenido);
        marcarError(idetiqueta, valor);
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;

    case "claveCarrera":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!regex.test(valor)) {
        mostrarError(
          input,
          "Solo se permite cuatro letras mayusculas al inicio, un guión -, 4 dijitos y 3 dijitos al final. Ejem. IINF-2010-220",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
    case "claveDocente":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!regexClavec.test(valor)) {
        mostrarError(
          input,
          "Solo se permite tres letras mayusculas al inicio, un guión medio - y 4 numeros. Ejem. TED-0001",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
    case "claveMateria":
      if (estaVacio) {
        mostrarError(input, "Este campo no puede estar vacío.", contenido);
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      if (!regexClavec.test(valor)) {
        mostrarError(
          input,
          "Solo se permite tres letras al inicio un guin medio y 4 dijitos ejem: AEB-1011",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
    case "IdPeriod":
      const soloNumeros = /^\d+$/;
      if (!soloNumeros.test(valor)) {
        mostrarError(
          input,
          "Selecciona una opción válida (solo números).",
          contenido
        );
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        return evaluarEstadoFormulariooferta(idbtn);
      }
      break;
  }
  evaluarEstadoFormulariooferta(idbtn);
}

function evaluarEstadoFormulariooferta(idbtn) {
  const idOferta = document.querySelector("#idOferta");
  const idsemestre = document.querySelector("#idSemestre");
  const idGrupo = document.querySelector("#idGrupo");
  const claveCarrera = document.querySelector("#claveCarrera");
  const claveMateria = document.querySelector("#claveMateria");
  const claveDocente = document.querySelector("#claveDocente");
  const idturno = document.querySelector("#turno");
  const idperiod = document.querySelector("#IdPeriod");

  //se limpian los valores
  const oferta = idOferta.value.trim();
  const semestre = idsemestre.value.trim();
  const grupo = idGrupo.value.trim();
  const carrera = claveCarrera.value.trim();
  const materia = claveMateria.value.trim();
  const docente = claveDocente.value.trim();
  const turno = idturno.value;
  const periodo = idperiod.value.trim();
  const errores = document.querySelectorAll(".errorscaracter");

  const camposCorrectos =
    oferta !== "" &&
    semestre !== "" &&
    grupo !== "" &&
    carrera !== "" &&
    materia !== "" &&
    docente !== "" &&
    turno !== "Seleccione un turno" &&
    periodo !== "";

  const clavecar = /^[A-Z]{4}-\d{4}-\d{3}$/.test(claveCarrera.value.trim());
  const clavedo = /^[A-Z]{3}-\d{4}$/.test(claveDocente.value.trim());
  const claveValidamat = /^[A-Z]{3}-\d{4}$/.test(claveMateria.value.trim());
  //console.log("campos llaves?", clavecar, " ", clavedo, " ", claveValidamat);

  const todoBien =
    errores.length === 0 &&
    camposCorrectos &&
    clavedo &&
    claveValidamat &&
    clavecar;

  deshabilitarboton(!todoBien, idbtn); // true = deshabilita, false = habilita
}

//funcion que se encarga de agregar los datos ala tabla
function agregarOfertaTabla() {
  const tablaOferta = $("#TablaDatosOferta").DataTable();

  const idOferta = siguienteID++;
  const semestre = $("#idSemestre").val();
  const estado = $('input[name="estado"]:checked').val();
  const grupo = $("#idGrupo").val();
  const turno = $("#turno").val();
  const nombreCarrera = $("#listaCarrera option:selected").text();
  const claveCarrera = $("#claveCarrera").val();
  const nombreDocente = $("#listaDocente option:selected").text();
  const claveDocente = $("#claveDocente").val();
  const periodo = $("#listaPeriodo option:selected").text();
  const idPeriodo = $("#IdPeriod").val();
  const nombreMateria = $("#listaMateria option:selected").text();
  const claveMateria = $("#claveMateria").val();

  // parte agregada para verificar si la oferta ya existe en la bd
  const datosOferta = {
    semestre: parseInt(semestre),
    grupo: grupo,
    turno: turno,
    claveCarrera: claveCarrera,
    claveMateria: claveMateria,
    idPeriodo: parseInt(idPeriodo),
    claveDocente: claveDocente,
  };

  verificarOfertaExiste(datosOferta, function (existeEnBD) {
    if (existeEnBD) {
      mostrarErrorCaptura("Esta oferta ya existe en la base de datos.");
      return;
    }
    //fin parte agregada

    const botonAcciones = `
      <div class="btn-group btn-group-sm" role="group">
          <button type="button" class="btn btn-danger" title="Eliminar" onclick="eliminarFila(this)">
              <i class="fas fa-trash-alt"></i>
          </button>
      </div>
    `;

    const badgeEstado =
      estado === "No asignado"
        ? '<span class="badge bg-success">Asignado</span>'
        : '<span class="badge bg-danger">No asignado</span>';

    tablaOferta.row
      .add([
        idOferta,
        semestre,
        badgeEstado,
        grupo,
        turno,
        nombreCarrera,
        claveCarrera,
        nombreDocente,
        claveDocente,
        periodo,
        idPeriodo,
        nombreMateria,
        claveMateria,
        botonAcciones,
      ])
      .draw(false);

    HayFilasEnTabla();

    // Limpiar campos
    $("#camposVacios input").val("");
    $("#listaMateria").val("Seleccione una Materia").trigger("change.select2");
    $("#listaDocente").val("Seleccione un docente").trigger("change.select2");
  });
}
//Se modifico ligeramente para reorganizar los id's
// funcion para eliminar la fila de la tabla
function eliminarFila(boton) {
  const tabla = $("#TablaDatosOferta").DataTable();

  // Eliminar la fila
  tabla.row($(boton).parents("tr")).remove().draw();

  // Obtener todos los datos y reordenar los IDs desde idOfertaInicial
  const todasLasFilas = tabla.rows().data().toArray();
  todasLasFilas.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < todasLasFilas.length; i++) {
    todasLasFilas[i][0] = idOfertaInicial + i;
    tabla.row(i).data(todasLasFilas[i]);
  }

  // Ajustar siguiente ID para futuras inserciones
  siguienteID--;

  tabla.draw();
  HayFilasEnTabla();
  cargarIdOferta();
}

// funcion que limpia la tabla al aguardar datos, toda la tabla
function limpiarTablaall() {
  const tabla = $("#TablaDatosOferta").DataTable();
  tabla.clear().draw();
}

//funcion que permite validar que no exitan registro con los mismo parametros
function existeOfertaEnTabla(
  semestre,
  grupo,
  turno,
  claveCarrera,
  claveDocente,
  idPeriodo,
  claveMateria
) {
  const tabla = $("#TablaDatosOferta").DataTable();
  const filas = tabla.rows().data();
  //console.log("Verificando si ya existe:", semestre, grupo, turno, claveCarrera, claveDocente, idPeriodo, claveMateria);

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];

    if (
      fila[1] === semestre &&
      fila[3] === grupo &&
      fila[4] === turno &&
      fila[6] === claveCarrera &&
      fila[8] === claveDocente &&
      fila[10] === idPeriodo &&
      fila[12] === claveMateria
    ) {
      return true;
    }
  }

  return false;
}

// funcion que permite saber si hay filas o no en la tabla y habilita o desabilita el boton de guardar
function HayFilasEnTabla() {
  const tabla = $("#TablaDatosOferta").DataTable();
  const totalFilas = tabla.rows().count();

  if (totalFilas === 0) {
    deshabilitarboton(true, "btnGuardarJ"); // Desactiva
  } else {
    deshabilitarboton(false, "btnGuardarJ"); // Activa
  }
}

function changeStatusOferta(id, status, currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado de la oferta <strong>${id}</strong> a <strong>${status}</strong>?</p>
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

      // Preparar datos para enviar
      let data = {
        id: id,
        status: status,
      };

      // Convertir a JSON
      let json = JSON.stringify(data);

      console.log(`Cambiando estado de oferta ${id} a ${status}`);

      // Realizar petición AJAX para cambiar el estado
      $.ajax({
        url: "../../Controlador/Intermediarios/Oferta/CambiarEstadoOferta.php",
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
                  option("oferta", "");
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
function guardarNuevaOferta() {
  const tabla = $("#TablaDatosOferta").DataTable();
  const filas = tabla.rows().data();
  const datosEnviar = [];

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];

    datosEnviar.push({
      clave: fila[0],
      semestre: fila[1],
      grupo: fila[3],
      turno: fila[4],
      claveCarrera: fila[6],
      claveDocente: fila[8],
      idPeriodo: fila[10],
      claveMateria: fila[12],
    });
  }

  fetch("../../Controlador/Intermediarios/Oferta/AgregarOferta.php", {
    method: "POST",
    body: JSON.stringify(datosEnviar),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((respuesta) => {
      console.log("Respuesta:", respuesta);
      if (respuesta.estado === "OK") {
        mostrarDatosGuardados(respuesta.mensaje);
        option("oferta", ""); //Refrescamos y redirigimos al main
        option
      } else {
        mostrarErrorCaptura(respuesta.mensaje);
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      mostrarErrorCaptura("Error al guardar las ofertas.");
    });
}
function cargarIdOferta() {
  
      document.getElementById('idOferta').value = siguienteID;
    
}

function verificarOfertaExiste(datos, callback) {
  $.ajax({
    url: "../../Controlador/Intermediarios/Oferta/VerificarOfertaExistente.php",
    method: "POST",
    data: JSON.stringify(datos),
    contentType: "application/json",
    dataType: "json",
    success: function (respuesta) {
      callback(respuesta.existe);
    },
    error: function () {
      mostrarErrorCaptura("Error al verificar la oferta.");
      callback(true); // asumimos que existe para no arriesgar
    },
  });
}

/*
 * Función para buscar una Oferta por su ID.
 * Envía una solicitud POST al servidor y, si tiene éxito, llena el formulario con los datos recibidos.
 * Además, desactiva el campo de clave de materia para evitar su edición.
 */
function BuscarOferta(id) {
  let url = "../../Controlador/Intermediarios/Oferta/ModificarOferta.php"; // Ruta al intermediario PHP

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
        document.getElementById("idOferta").value =
          response.datos.clave_de_oferta;
        document.getElementById("idSemestre").value = response.datos.semestre;
        document.getElementById("idGrupo").value = response.datos.grupo;
        document.getElementById("turno").value = response.datos.turno;
        document.getElementById("claveCarrera").value =
          response.datos.clave_de_carrera;
        document.getElementById("claveMateria").value =
          response.datos.clave_de_materia;
        document.getElementById("IdPeriod").value =
          response.datos.clave_periodo;
        document.getElementById("claveDocente").value =
          response.datos.clave_de_docente;
        document.getElementById("estado").value = response.datos.estado;

        $('#listaCarrera').val(response.datos.clave_de_carrera).trigger('change');
        $('#listaPeriodo').val(response.datos.clave_periodo).trigger('change');
        $('#listaDocente').val(response.datos.clave_de_docente).trigger('change');

        //document.getElementById("listaMateria").value = response.datos.clave_de_materia;

      } else {
        // Si no se encontró la materia, se muestra un mensaje
        mostrarErrorCaptura(response.mensaje);
      }
    },
    "json" // Especificamos que la respuesta esperada es JSON
  ).fail(function (xhr, status, error) {
    // Manejo de errores de conexión o servidor
    console.error("Error en la solicitud POST:", xhr.responseText);
    mostrarErrorCaptura("Error al buscar la Oferta.");
  });
}

/*
 * Función para modificar los datos de una Oferta existente.
 */
function ModificarOferta() {
  // Capturamos y limpiamos los datos del formulario
  const idOf = document.getElementById("idOferta").value.trim();
  const semestre = document.getElementById("idSemestre").value.trim();
  const grupo = document.getElementById("idGrupo").value.trim();
  const turno = document.getElementById("turno").value.trim();
  const claveCar = document.getElementById("claveCarrera").value.trim();
  const claveMat = document.getElementById("claveMateria").value.trim();
  const idP = document.getElementById("IdPeriod").value.trim();
  const claveDoc = document.getElementById("claveDocente").value.trim();

  // Validamos que todos los campos requeridos estén llenos
  if (
    !idOf ||
    !semestre ||
    !grupo ||
    !turno ||
    !claveCar ||
    !claveMat ||
    !idP ||
    !claveDoc
  ) {
    mostrarFaltaDatos(
      "Por favor, complete todos los campos obligatorios para continuar."
    );
    return;
  }

  // Construimos el objeto con los datos a enviar
  let datos = {
    idOferta: idOf,
    semestre: semestre,
    grupo: grupo,
    turno: turno,
    claveCarrera: claveCar,
    claveMateria: claveMat,
    idPeriodo: idP,
    claveDocente: claveDoc,
    Modificar: true,
  };

  let json = JSON.stringify(datos); // Convertimos a JSON
  let url = "../../Controlador/Intermediarios/Oferta/ModificarOferta.php"; // URL del intermediario
  console.log("Datos JSON enviados:", json);

  // Enviamos la solicitud POST
  $.post(
    url,
    json,
    function (response, status) {
      // Si la modificación fue exitosa, mostramos mensaje de éxito
      if (response.success) {
        mostrarDatosGuardados(response.mensaje, "");
        option("oferta", ""); // Refrescamos o redirigimos según sea necesario
      } else {
        // Si hubo un error, lo mostramos al usuario
        mostrarErrorCaptura(response.mensaje);
      }
    },
    "json" // Indicamos que esperamos JSON como respuesta
  ).fail(function (xhr, status, error) {
    // Manejamos fallos de conexión o servidor
    console.error(
      "Error en la solicitud POST Modificar Oferta:",
      xhr.responseText
    );
    mostrarErrorCaptura(
      "No se pudo conectar con el servidor. Inténtelo más tarde."
    );
  });
}



