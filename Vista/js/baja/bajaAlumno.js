//Autor: Miguel Angel Lara Hermosillo
//Fecha de creación: 08/09/2025
//Descripción: Funciones JS para el módulo de baja de alumnos manual

// Funcion que permite cargar los formularios de baja de alumnos
// y ejecutar las funciones necesarias para cada uno
function loadFormBajaAlumnos(opc, id = "") {
  let url = "";
  if (opc === "bajaManual") {
    url = "baja/bajaManual.php";
  } else if (opc === "modBaja") {
    url = "baja/modBaja.html";
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
              iniciarFuncionesBajaAlumnos(opc, id); // Iniciar funciones específicas para baja
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

// Función para validar los campos antes de enviar el formulario
function validarFormularioBaja() {
  const nombreAlumno = document.getElementById("nombreAlumno").value.trim();
  const carreraAlumno = document.getElementById("carreraAlumno").value.trim();
  const periodoAlumno = document.getElementById("periodo_nombre").value.trim();
  const motivoBaja = document.getElementById("motivoBaja").value.trim();
  const tipoBaja = document.getElementById("tipoBaja").value;
  const idperiodo = document.getElementById("idperiodo").value;

  // validar que los campos no esten vacios y que no tengan errores
  if (
    nombreAlumno === "" ||
    carreraAlumno === "" ||
    periodoAlumno === "" ||
    motivoBaja === "" ||
    tipoBaja === "" ||
    idperiodo === ""
  ) {
    // Mostrar mensaje de error
    mostrarFaltaDatos(
      "No se pueden dejar campos vacíos. Verifique e intente de nuevo."
    );
    return false;
  } else {
    // Si todo es correcto, se puede enviar el formulario
    mostrarDatosGuardados("La baja a sido aplicada correctamente.");
    //desabilitamos el boton de guardar
    btnGuardarJ.disabled = true;
  }
}

//funcion para validar el numero de control al escribir
function validarNumeroControlBaja(idInput, btn, cont) {
  const input = document.getElementById(idInput);
  const bton = document.getElementById(btn);

  const valor = input.value.trim();
  const iconerror = document.querySelector(`#${idInput}`);
  const contenedor = input.closest("." + cont);

  const soloNumeros = /^[0-9]+$/; // Expresión regular para solo números

  /**Eliminar mensaje de error si existe**/

  // Buscar mensaje de error por mensaje
  const errorMensaje = contenedor.querySelector(".errorscaracter");
  if (errorMensaje) {
    errorMensaje.remove();
  }

  // Buscar otros errores (is-invalid) para eliminarlos si todo es correcto
  const errorInvalid = contenedor.querySelector(".is-invalid");
  if (errorInvalid) {
    errorInvalid.classList.remove("is-invalid");
    input.classList.remove("entrada-error");
  }

  // Validar si el valor está vacío o no coincide con el formato

  if (valor === "" || !soloNumeros.test(valor)) {
    input.classList.add("entrada-error");
    iconerror.classList.add("is-invalid");
    MostrarAlertaBaja(
      input,
      "El número de control debe ser solo números y no debe estar vacío.",
      cont
    );
    bton.disabled = true;
  } else {
    // Si todo es correcto se activa el boton
    bton.disabled = false;
  }
}

//validar el motivo de baja
function validarCamposRestantesBaja(idInput, btn, cont) {
  const input = document.getElementById(idInput);

  const bton = document.getElementById(btn);
  const valor = input.value.trim();
  const iconerror = document.querySelector(`#${idInput}`);
  const contenedor = input.closest("." + cont);

  /**Eliminar mensaje de error si existe**/

  // Buscar mensaje de error por mensaje
  const errorMensaje = contenedor.querySelector(".errorscaracter");
  if (errorMensaje) {
    errorMensaje.remove();
  }

  // Buscar otros errores (is-invalid) para eliminarlos si todo es correcto
  const errorInvalid = contenedor.querySelector(".is-invalid");
  if (errorInvalid) {
    errorInvalid.classList.remove("is-invalid");
    input.classList.remove("entrada-error");
  }

  switch (idInput) {
    case "idperiodo":
      if (valor === "") {
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        MostrarAlertaBaja(
          input,
          "Valor no encontrado del periodo, intenta de nuevo.",
          cont
        );
        return activarBotonSiTodoCorrectoBaja(bton);
      } else if (periodoYaRegistradobaja(valor)) {
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        MostrarAlertaBaja(
          input,
          "El alumno ya cuenta con una baja en el periodo seleccionado.",
          cont
        );
        return activarBotonSiTodoCorrectoBaja(bton);
      }
      break;
    case "motivoBaja":
      if (valor === "") {
        input.classList.add("entrada-error");
        iconerror.classList.add("is-invalid");
        MostrarAlertaBaja(
          input,
          "El motivo de baja no debe estar vacío.",
          cont
        );
        return activarBotonSiTodoCorrectoBaja(bton);
      }
      break;
  }
  activarBotonSiTodoCorrectoBaja(bton);
}

// Activa el botón de guardar si todos los campos están correctos
function activarBotonSiTodoCorrectoBaja(btnId) {
  // Campos requeridos
  const idsCampos = ["idperiodo", "motivoBaja", "tipoBaja"];

  const camposValidos = idsCampos.every((id) => {
    const input = document.getElementById(id);

    if (!input) return false; // por si algún id no existe

    const tieneError =
      input.classList.contains("entrada-error") ||
      input.classList.contains("is-invalid");

    const tieneValor = input.value && input.value.trim() !== "";

    return !tieneError && tieneValor;
  });

  btnId.disabled = !camposValidos;
}

//funcion para buscar alumno y mostrar sus datos,
function buscarAlumnoBaja() {
  if (!limpiarDatosDeCampo()) {
    mostrarMensajeBaja("Error, no se encontraron los campos para limpiarlos");
    setEstadoBajas("Error");
    return;
  }

  const alumnos = {
    12345678: {
      nombre: "Juan Pérez",
      carrera: "Ingeniería en Informática",
      historial: [
        { id: 1, nombre: "2022-2" },
        { id: 2, nombre: "2023-1" },
      ],
    },
    87654321: {
      nombre: "María López",
      carrera: "Administración",
      historial: [{ id: 3, nombre: "2021-2" }],
    },
  };

  const noControl = document.getElementById("id_alumno").value.trim();
  const loader = document.getElementById("loader");

  // Ocultar datos previos y mostrar loader
  document.getElementById("alumnoInfo").classList.add("d-none");
  document.getElementById("datosAlumno").classList.add("d-none");
  document.getElementById("contenedorHistorial").classList.add("d-none");
  loader.classList.remove("d-none");

  // Simular tiempo de espera como si fuera un fetch (1.5s)
  setTimeout(() => {
    loader.classList.add("d-none"); // ocultar loader

    const alumno = alumnos[noControl];

    if (!alumno) {
      mostrarMensajeBaja(
        "No se encontró ningún alumno con ese número de control."
      );
      setEstadoBajas("Error");
      return;
    }

    // Alumno válido encontrado
    mostrarMensajeBaja(
      "El estado de la baja será 'Aplicada' por defecto",
      true
    );
    setEstadoBajas("encontrado");

    // Rellenar datos
    document.getElementById("nombreAlumno").value = alumno.nombre;
    document.getElementById("carreraAlumno").value = alumno.carrera;

    // Mostrar historial de bajas en la tabla
    const tablaHistorial = document.getElementById("tablaHistorial");
    tablaHistorial.innerHTML = "";

    if (alumno.historial.length === 0) {
      tablaHistorial.innerHTML =
        '<tr><td colspan="2" class="text-muted text-center">No tiene bajas registradas</td></tr>';
    } else {
      alumno.historial.forEach((periodo) => {
        tablaHistorial.innerHTML += `
          <tr>
            <td>${periodo.id}</td>
            <td>${periodo.nombre}</td>
          </tr>
        `;
      });
    }
  }, 1500); // 1.5 segundos
}

// Funcion que limpia los campos antes de mostrar nuevos datos
function limpiarDatosDeCampo() {
  let seEncontraron = true;

  let campos = ["periodo_nombre", "idperiodo", "tipoBaja", "motivoBaja"];

  for (let id of campos) {
    let el = document.getElementById(id);
    if (el) {
      if (el.tagName === "SELECT") {
        el.selectedIndex = 0;
      } else if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
        el.value = "";
      }
    } else {
      seEncontraron = false;
    }
  }

  return seEncontraron;
}

// Funcion que permite saber si un alumno ya cuenta con una baja en un periodo en espesifico
function periodoYaRegistradobaja(idPeriodo) {
  const filas = document.querySelectorAll("#tablaHistorial tr");
  let existe = false;

  filas.forEach((fila) => {
    const id = fila.cells[0].textContent.trim(); // primera celda = ID Periodo
    if (id === idPeriodo) {
      existe = true;
    }
  });

  return existe;
}

// Función auxiliar para mostrar mensajes en el setEstado
function mostrarMensajeBaja(texto, mostrarDatos = false) {
  const info = document.getElementById("alumnoInfo");
  const datos = document.getElementById("datosAlumno");

  info.classList.remove("d-none");
  info.textContent = texto;

  if (mostrarDatos) {
    datos.classList.remove("d-none");
  } else {
    datos.classList.add("d-none");
  }
}

function setEstadoBajas(estado) {
  const div = document.getElementById("alumnoInfoclass");

  // Quita las clases de Bootstrap que no correspondan
  div.classList.remove("alert-success", "alert-info", "alert-danger");

  switch (estado) {
    case "encontrado":
      div.classList.add("alert-success");
      break;
    case "Error":
      div.classList.add("alert-danger");
      break;
    default:
      div.classList.add("alert-info");
      break;
  }
}

// Función para mostrar alertas
function MostrarAlertaBaja(input, mensaje, contenedor) {
  const contenedorCampo = input.closest(`.${contenedor}`);
  // Sequita el error si ya existia antes
  const errorPrevio = contenedorCampo.querySelector(".errorscaracter");
  if (errorPrevio) errorPrevio.remove();
  const alerta = document.createElement("p");
  alerta.textContent = mensaje;
  alerta.classList.add("errorscaracter");
  contenedorCampo.appendChild(alerta); // Insertamos debajo del input group y dentro del contenedorcampo

  //Eliminar despues de 3 seg
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

// funcion que permite iniciar otras funciones
function iniciarFuncionesBajaAlumnos(opc, id) {
  switch (opc) {
    case "buscarAlumno":
      buscarAlumnoBaja();
      break;
    case "modBaja":
      cargarDatosSelectPeriodosMod(function() {
       
        cargarDatosBaja(id);
    });
      break;
  }
}
