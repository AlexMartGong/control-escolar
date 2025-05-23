/**
 * Función para cargar contenido dinámicamente en la página
 * @param {string} opc - Opción seleccionada (career, period, etc.)
 * @param {string} filter - Filtro opcional para la consulta
 */
function option(opc, filter) {
  try {
    if (typeof $ === "undefined") {
      console.error("jQuery no está cargado");
      alert("Error: jQuery no está disponible");
      return;
    }

    let mainContent = $("#mainContent"); // Usamos jQuery para manipulación más fácil
    if (!mainContent.length) {
      console.error("Elemento mainContent no encontrado");
      return;
    }

    let url = "";
    switch (opc) {
      case "docente":
        url = "docente/main.php";
        break;
      case "period":
        url = "period/main.php";
        break;
      case "period-edit":
        url = "period/modPeriodo.php?id=" + filter;
        break;
      case "career-manager":
        url = "career-manager/main.php";
        break;
      case "carrera":
        url = "carrera/main.php";
        break;
      case "materia":
        url = "materia/main.php";
        break;
      case "oferta":
        url = "oferta/main.php";
        break;
      case "student":
        url = "alumno/main.php";
        break;
      default:
        mainContent.html(
          '<div class="alert alert-warning">Opción no válida</div>'
        );
        return;
    }

    let data = { filter: filter || "" };
    let json = JSON.stringify(data);
    //console.log(`Cargando ${opc} con filtro: ${json}`);

    // Animación: desvanecer el contenido actual antes de limpiarlo
    mainContent.fadeOut(300, function () {
      mainContent
        .html(
          '<div class="text-center"><i class="fas fa-spinner fa-spin fa-3x"></i><p class="mt-2">Cargando...</p></div>'
        )
        .fadeIn(200);

      $.ajax({
        url: url,
        type: "POST",
        data: json,
        contentType: "application/json",
        timeout: 10000, // 10 segundos de timeout
        success: function (responseText) {
          // Animación: desvanecer el spinner antes de mostrar el nuevo contenido
          mainContent.fadeOut(300, function () {
            mainContent.html(responseText).fadeIn(300);

            // Llamar a obtenerPeriodo después de que el contenido se ha cargado
            obtenerPeriodo();

            // Inicializar DataTables después de la animación
            if ($.fn.DataTable) {
              try {
                   const commonConfig = {
                  responsive: true,
                  pageLength: 25,
                  order: [[0, "desc"]],
                   pagingType: "simple_numbers",
                  lengthMenu: [
                    [25, 50, 100, -1],
                    [25, 50, 100, "Todos"],
                  ],
                  language: {
                    url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json",
                    paginate: {
                      previous: "Anterior",
                      next: "Siguiente",
                    },
                  },
                };
                  if (opc === "student" && $("#tableAlumnos").length) {
                  $("#tableAlumnos").DataTable({
                    ...commonConfig,
                    columnDefs: [
                      { searchable: true, targets: [0, 1] },
                      { searchable: false, targets: "_all" },
                    ],
                  });
                }
                if (opc === "docente" && $("#tableDocente").length) {
                  $("#tableDocente").DataTable({
                    ...commonConfig,
                    language: {
                      url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json",
                      emptyTable:
                        "No hay registros por el momento de Docentes para Mostrar",
                    },
                    columnDefs: [
                      { searchable: true, targets: [0, 1] },
                      { searchable: false, targets: "_all" },
                    ],
                  });
                }
                if (
                  opc === "career-manager" &&
                  $("#tableCareerManager").length
                ) {
                  $("#tableCareerManager").DataTable({
                    ...commonConfig,
                    language: {
                      url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json",
                      emptyTable:
                        "No hay registros por el momento de Jefe de Carrera para Mostrar",
                    },
                    columnDefs: [
                      { searchable: true, targets: [1] },
                      { searchable: false, targets: "_all" },
                    ],
                  });
                }
                if (opc === "period" && $("#tablePeriod").length) {
                  $("#tablePeriod").DataTable({
                    ...commonConfig,
                    language: {
                      url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json",
                      emptyTable:
                        "No hay registros por el momento de Periodos para Mostrar",
                    },
                    columnDefs: [
                      { searchable: true, targets: [1] },
                      { searchable: false, targets: "_all" },
                    ],
                  });
                }

                if (opc === "carrera" && $("#tableCarrera").length) {
                  $("#tableCarrera").DataTable({
                    ...commonConfig,
                    language: {
                      url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json",
                      emptyTable:
                        "No hay registros por el momento de Carreras para Mostrar",
                    },
                    columnDefs: [
                      { searchable: true, targets: [0, 1] },
                      { searchable: false, targets: "_all" },
                    ],
                  });
                }

                if (opc === "materia" && $("#tableMateria").length) {
                  $("#tableMateria").DataTable({
                    ...commonConfig,
                    language: {
                      url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json",
                      emptyTable:
                        "No hay registros por el momento de Materias para Mostrar",
                    },
                    columnDefs: [
                      { searchable: true, targets: [0, 1] },
                      { searchable: false, targets: "_all" },
                    ],
                  });
                }

                if (opc === "oferta" && $("#tableOferta").length) {
                  $("#tableOferta").DataTable({
                    ...commonConfig,
                    language: {
                      url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json",
                      emptyTable:
                        "No hay registros por el momento de ofertas para mostrar",
                    },
                    columnDefs: [
                      { searchable: true, targets: [0, 1, 2, 3, 5, 7] },
                      { searchable: false, targets: "_all" },
                    ],
                  });
                }

                $("table.dataTable")
                  .not("#tableCareer, #tableCareerManager, #tablePeriod")
                  .each(function () {
                    if (!$.fn.DataTable.isDataTable(this)) {
                      $(this).DataTable(commonConfig);
                    }
                  });
              } catch (tableError) {
                console.error("Error al inicializar DataTable:", tableError);
              }
            }
          });
        },
        error: function (xhr, status, error) {
          mainContent.fadeOut(300, function () {
            mainContent
              .html(
                `
                            <div class="alert alert-danger">
                                <h4>Error al cargar el contenido</h4>
                                <p>Estado: ${status}</p>
                                <p>Error: ${error}</p>
                            </div>
                        `
              )
              .fadeIn(300);
          });
          console.error(`Error en la petición: ${status} - ${error}`);
        },
      });
    });
  } catch (e) {
    console.error("Error general:", e);
    alert("Ocurrió un error: " + e.message);
  }
}

/**
 * Función para validar el formulario de periodo
 * Integración con la función existente validafrmPeriodo
 */
function validafrmPeriodo(mensaje, tipoOp) {
  switch (tipoOp) {
    case "Agregar":
      console.log("Voy a comenzar a Agregar");

      return AgregarPeriodo(mensaje);

    case "Modificar":
      console.log("Voy a comenzar a Modificar");

      return ModificarPeriodo(mensaje);

    default:
      return false;
  }
}

function validarBusqueda() {
  // Obtener los valores de los campos del formulario
  const id = document.getElementById("txtId").value.trim();
  const periodo = document.getElementById("txtPeriodo").value.trim();
  // Validar campos obligatorios
  if (!id && !periodo) {
    mostrarFaltaDatos('Ingrese el "ID periodo" o "Periodo" correctamente"');
    return false;
  }

  // Validar que si hay un ID ingresado, sea un número
  if (id && isNaN(id)) {
    mostrarErrorCaptura("Por favor, ingrese un ID válido (solo números).");
    return false;
  }

  //Mandar a llamar el metodo buscarPeriodo
  buscarPeriodo();
}

//Modal que se muestra si no se encontraron resultados en la Base de datos
function sinres(mensaje) {
  // Crear el contenido del modal
  let modalHTML = ` 
        <div class="modal fade" id="errorCapturaModal" tabindex="-1" aria-labelledby="errorCapturaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="errorCapturaModalLabel">
                            <i class="fas fa-exclamation-triangle me-2"></i>SIN COINCIDENCIAS
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-2 me-5">
                            <i class="fas fa-times-circle text-primary fa-4x"></i>
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

function clearArea(myArea) {
  document.getElementById(myArea).innerHTML = "";

  switch (myArea) {
    case "frmAdd":
      option("career-manager", "");
      break;
    case "frmmod":
      option("career-manager", "");
      break;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("show");
    });

    // Cerrar menú al hacer clic en un enlace (en dispositivos móviles)
    const navLinks = sidebar.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 992) {
          sidebar.classList.remove("show");
        }
      });
    });

    // Cerrar menú al hacer clic fuera del mismo
    document.addEventListener("click", function (event) {
      const isClickInsideMenu = sidebar.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);

      if (
        !isClickInsideMenu &&
        !isClickOnToggle &&
        sidebar.classList.contains("show")
      ) {
        sidebar.classList.remove("show");
      }
    });
  }

  // Ajustar diseño cuando cambia el tamaño de la ventana
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 992 && sidebar.classList.contains("show")) {
      sidebar.classList.remove("show");
    }
  });
});

/**
 * Función para mostrar ventana modal de error de captura
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorCaptura(mensaje) {
  // Crear el contenido del modal
  let modalHTML = `
    <div class="modal fade" id="errorCapturaModal" tabindex="-1" aria-labelledby="errorCapturaModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="errorCapturaModalLabel">
                        <i class="fas fa-exclamation-triangle me-2"></i>Error de Captura
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3">
                        <i class="fas fa-times-circle text-danger fa-4x"></i>
                    </div>
                    <p class="text-center">${
                      mensaje ||
                      "Se ha producido un error durante la captura de datos."
                    }</p>
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

/**
 * Función para mostrar ventana de alerta por falta de datos
 * @param {string} mensaje - Mensaje específico sobre los datos faltantes
 * @param {Function} callback - Función a ejecutar al confirmar (opcional)
 */
function mostrarFaltaDatos(mensaje, callback) {
  // Crear el contenido del modal
  let modalHTML = `
    <div class="modal fade" id="faltaDatosModal" tabindex="-1" aria-labelledby="faltaDatosModalLabel" >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title" id="faltaDatosModalLabel">
                        <i class="fas fa-exclamation-circle me-2"></i>Datos Incompletos
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3 me-3">
                        <i class="fas fa-clipboard-list text-warning fa-4x"></i>
                    </div>
                    <p class="text-center">${
                      mensaje ||
                      "Hay campos obligatorios sin completar. Por favor, revise el formulario."
                    }</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="btnEntendido" data-bs-dismiss="modal">Entendido</button>
                </div>
            </div>
        </div>
    </div>`;

  // Remover modal anterior si existe
  let modalAnterior = document.getElementById("faltaDatosModal");
  if (modalAnterior) {
    modalAnterior.remove();
  }

  // Agregar el modal al documento
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mostrar el modal
  let modalElement = document.getElementById("faltaDatosModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Configurar callback si se proporciona
  if (typeof callback === "function") {
    document.getElementById("btnEntendido").addEventListener("click", callback);
  }

  // Eliminar el modal del DOM cuando se cierre
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

/**
 * Función para mostrar ventana de éxito cuando se guardan datos
 * @param {string} mensaje - Mensaje de éxito a mostrar
 * @param {Function} callback - Función a ejecutar al confirmar (opcional)
 */
function mostrarDatosGuardados(mensaje, callback) {
  // Crear el contenido del modal
  let modalHTML = `
    <div class="modal fade" id="datosGuardadosModal" tabindex="-1" aria-labelledby="datosGuardadosModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="datosGuardadosModalLabel">
                        <i class="fas fa-check-circle me-2"></i>Operación Exitosa
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-3 me-4">
                        <i class="fas fa-save text-success fa-4x"></i>
                    </div>
                    <p class="text-center">${
                      mensaje || "Los datos se han guardado correctamente."
                    }</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="btnAceptar" data-bs-dismiss="modal">Aceptar</button>
                </div>
            </div>
        </div>
    </div>`;

  // Remover modal anterior si existe
  let modalAnterior = document.getElementById("datosGuardadosModal");
  if (modalAnterior) {
    modalAnterior.remove();
  }

  // Agregar el modal al documento
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mostrar el modal
  let modalElement = document.getElementById("datosGuardadosModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Configurar callback si se proporciona
  if (typeof callback === "function") {
    document.getElementById("btnAceptar").addEventListener("click", callback);
  }

  // Eliminar el modal del DOM cuando se cierre
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

function errorActualizacion(mensaje) {
  // Crear el contenido del modal
  let modalHTML = ` 
    <div class="modal fade" id="errorActualizacionModal" tabindex="-1" aria-labelledby="errorActualizacionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="errorActualizacionModalLabel">
                        <i class="fas fa-exclamation-triangle me-2"></i>STATUS NO PERMITIDO
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-2 me-5">
                        <i class="fas fa-times-circle text-danger fa-4x"></i>
                    </div>
                    <p class="text-center text-danger">${mensaje}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>`;

  // Remover modal anterior si existe
  let modalAnterior = document.getElementById("errorActualizacionModal");
  if (modalAnterior) {
    modalAnterior.remove();
  }

  // Agregar el modal al documento
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mostrar el modal
  let modalElement = document.getElementById("errorActualizacionModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Eliminar el modal del DOM cuando se cierre
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

$(document).on("click", ".btnEditar", function () {
  let id = $(this).data("id");
  console.log("Click en editar. ID del periodo:", id);

  if (!$("#modPeriodo").length) {
    console.warn("⚠️ El modal #modPeriodo no existe en el DOM.");
  } else {
    console.log("✅ El modal #modPeriodo sí existe.");
  }

  $("#txtId").val(id);
  buscarPeriodo();

  // Probar manualmente si se puede abrir el modal
  $("#modPeriodo").modal("show");
});
