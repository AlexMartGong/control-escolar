function loadFormHorario(opc, id = "") {
    let url = "";
    if (opc === "frmHorario") {
        url = "horario/frmHorario.html";
    } else if (opc === "modHorario") {
        url = "horario/modHorario.html";
    } else if (opc === "modalumno") {
        url = "horario/modalumno.html";
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

                            if (opc === "frmHorario") {
                                cargarCarrerasfrmAgr();
                                inicializarFormularioHorario();
                            }

                            if (opc === "modHorario") {
                                cargarCarrerasfrmAgr();
                                inicializarFormularioModificarHorario();
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

function changeStatusHorario(id, status, currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado del horario <strong>${id}</strong> a <strong>${status}</strong>?</p>
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
    document.getElementById("btnConfirmar").addEventListener("click", function () {
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
                            `El estado del horario ${id} ha sido cambiado a "${status}" correctamente.`,
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

// Función para inicializar el formulario de horarios
function inicializarFormularioHorario() {
    // Cargar información del período activo
    cargarPeriodoActivo();

    // Configurar event listeners para los selects
    configurarEventListenersHorario();

    // Limpiar contadores
    actualizarContadores(0, 0);

    // Deshabilitar botón guardar inicialmente
    $("#btnGuardarHorario").prop('disabled', true);
}

// Función para cargar información del período activo
function cargarPeriodoActivo() {
     fetch('../../Controlador/Intermediarios/Periodo/ObtenerPeriodoValido.php')
    .then(response => response.json())
    .then(data => {
      const spanPeriodo = document.getElementById('periodoInfo');

      if (Array.isArray(data.datos) && data.datos.length > 0) {
        const periodo = data.datos[0];
        const texto = `${periodo.periodo} (Estado: ${periodo.estado}, Ajustes hasta: ${periodo.fecha_de_termino_ajustes})`;
        spanPeriodo.textContent = texto;
      } else {
        spanPeriodo.textContent = 'No hay periodo activo disponible.';
      }
    })
    .catch(error => {
      console.error('Error cargando el periodo activo:', error);
      document.getElementById('periodoInfo').textContent = 'Error al cargar la información del periodo.';
    });
}

// Función para cargar carreras en el formulario de agregar horario
function cargarCarrerasfrmAgr() {
    // Realiza una solicitud HTTP GET al archivo PHP que devuelve las carreras activas
  return fetch('../../Controlador/Intermediarios/Carrera/ObtenerCarrerasActivas.php')
    // Convierte la respuesta en un objeto JSON
    .then(response => response.json())
    // Una vez que se tiene el objeto JSON
    .then(data => {
      // Obtiene el elemento <select> donde se van a insertar las carreras
      const select = document.getElementById('claveCarrera');
      
      // Limpia el <select> y agrega una opción por defecto deshabilitada y seleccionada
      select.innerHTML = '<option disabled selected>Seleccione una Carrera</option>';

      // Verifica si el arreglo 'datos' dentro del JSON contiene al menos una carrera
      if (data.datos && data.datos.length > 0) {
        // Recorre cada carrera y la agrega como una opción dentro del <select>
        data.datos.forEach(carrera => {
          const option = document.createElement('option'); // Crea una nueva opción
          option.value = carrera.clave_de_carrera;         // Establece el valor (clave)
          option.textContent = `${carrera.clave_de_carrera} - ${carrera.nombre_de_carrera}`;  // Establece el texto visible
          select.appendChild(option);                      // Agrega la opción al <select>
        });
      }
    })
    // Captura cualquier error que ocurra en la solicitud o el procesamiento de datos
    .catch(error => {
      console.error('Error cargando Carreras:', error); // Muestra el error en la consola
      throw error; // Propaga el error para que pueda ser manejado por quien llame esta función
    });
}

// Función para configurar los event listeners del formulario
function configurarEventListenersHorario() {
    // Event listener para cambio de carrera
    $("#claveCarrera").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupo();
        } else {
            limpiarTablas();
        }
    });

    // Event listener para cambio de semestre
    $("#semestre").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupo();
        } else {
            limpiarTablas();
        }
    });

    // Event listener para cambio de grupo
    $("#grupo").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupo();
        } else {
            limpiarTablas();
        }
    });

    // Event listener para cambio de turno
    $("#turno").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupo();
        } else {
            limpiarTablas();
        }
    });

    // Event listener para botón guardar
    $("#btnGuardarHorario").off('click').on('click', function () {
        guardarHorarios();
    });

    // Event listener para botón cancelar
    $(".btn-outline-secondary").off('click').on('click', function () {
        cancelarFormulario();
    });
}

// Función para validar que todos los campos estén seleccionados
function validarSeleccionCompleta() {
    const carrera = $("#claveCarrera").val();
    const semestre = $("#semestre").val();
    const grupo = $("#grupo").val();
    const turno = $("#turno").val();

    return carrera !== "" && semestre !== "" && grupo !== "" && turno !== "";
}

// Función para cargar datos del grupo (alumnos y ofertas)
function cargarDatosGrupo() {
    const carrera = $("#claveCarrera").val();
    const semestre = $("#semestre").val();
    const grupo = $("#grupo").val();
    const turno = $("#turno").val();
    
    if (!validarSeleccionCompleta()) {
        return;
    }

    // Mostrar indicadores de carga
    mostrarCargandoAlumnos();
    mostrarCargandoOfertas();

    // Cargar alumnos
    cargarAlumnosGrupo(carrera, semestre, grupo, turno);

    // Cargar ofertas
    cargarOfertasGrupo(carrera, semestre, grupo, turno);
}

function cargarAlumnosGrupo(carrera, semestre, grupo, turno) {
  // Validar que los parámetros estén definidos y no vacíos
  if (!carrera || !semestre || !grupo || !turno) {
    console.error("Faltan parámetros para cargar alumnos.");
    mostrarAlumnos([]); // Mostrar vacío o mensaje si quieres
    return;
  }

  // Construir el objeto con los datos para enviar
  const datos = {
    claveCarrera: carrera,
    semestre: semestre,
    grupo: grupo,
    turno: turno
  };

  // Llamar al intermediario con fetch y POST
  fetch('../../Controlador/Intermediarios/Horario/BuscarAlumnosHorarioGrupal.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
    .then(response => {
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      return response.json();
    })
    .then(data => {
         console.log("Respuesta del servidor:", data);
      if (data.estado === "OK") {
        mostrarAlumnos(data.datos);
      } else {
        console.warn("No se encontraron alumnos o hubo error:", data.mensaje);
        mostrarAlumnos([]);
      }
    })
    .catch(error => {
      console.error("Error al cargar alumnos del grupo:", error);
      mostrarAlumnos([]);
    });
}

// Función para cargar ofertas del grupo
function cargarOfertasGrupo(carrera, semestre, grupo, turno) {
     // Validar que los parámetros estén definidos y no vacíos
  if (!carrera || !semestre || !grupo || !turno) {
    console.error("Faltan parámetros para cargar alumnos.");
    mostrarOfertas([]); // Mostrar vacío o mensaje si quieres
    return;
  }

  // Construir el objeto con los datos para enviar
  const datos = {
    claveCarrera: carrera,
    semestre: semestre,
    grupo: grupo,
    turno: turno
  };

  // Llamar al intermediario con fetch y POST
  fetch('../../Controlador/Intermediarios/Horario/BuscarOfertasHorarioGrupal.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
    .then(response => {
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      return response.json();
    })
    .then(data => {
         console.log("Respuesta del servidor:", data);
      if (data.estado === "OK") {
        mostrarOfertas(data.datos);
      } else {
        console.warn("No se encontraron Ofertas o hubo error:", data.mensaje);
        mostrarOfertas([]);
      }
    })
    .catch(error => {
      console.error("Error al cargar alumnos del grupo:", error);
      mostrarOfertas([]);
    });
}

// Función para mostrar indicador de carga en alumnos
function mostrarCargandoAlumnos() {
    $("#cuerpoAlumnos").html(`
        <tr>
            <td colspan="4" class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x mb-2"></i>
                <p class="mb-0">Cargando alumnos...</p>
            </td>
        </tr>
    `);
}

// Función para mostrar indicador de carga en ofertas
function mostrarCargandoOfertas() {
    $("#cuerpoOfertas").html(`
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x mb-2"></i>
                <p class="mb-0">Cargando ofertas...</p>
            </td>
        </tr>
    `);
}

// Función para mostrar alumnos en la tabla
function mostrarAlumnos(alumnos) {
    let html = '';

    if (alumnos.length === 0) {
        html = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-user-slash fa-2x mb-2"></i>
                    <p class="mb-0">No se encontraron alumnos para esta selección</p>
                </td>
            </tr>
        `;
    } else {
        alumnos.forEach(alumno => {
            const estadoBadge = alumno.estado === 'Activo'
                ? '<span class="badge bg-success">Activo</span>'
                : '<span class="badge bg-danger">Inactivo</span>';

            html += `
                <tr>
                    <td>${alumno.numero_de_control}</td>
                    <td>${alumno.nombre_de_alumno}</td>
                    <td>${alumno.semestre}°</td>
                    <td>${estadoBadge}</td>
                </tr>
            `;
        });
    }

    $("#cuerpoAlumnos").html(html);
    actualizarContadores(alumnos.length, null);
    verificarHabilitarGuardar();
}

// Función para mostrar ofertas en la tabla
function mostrarOfertas(ofertas) {
    let html = '';

    if (ofertas.length === 0) {
        html = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-clipboard-list fa-2x mb-2"></i>
                    <p class="mb-0">No se encontraron ofertas para esta selección</p>
                </td>
            </tr>
        `;
    } else {
        ofertas.forEach(oferta => {
            html += `
                <tr>
                    <td>${oferta.clave_de_oferta}</td>
                    <td>${oferta.clave_de_materia}</td>
                    <td>${oferta.nombre_de_materia}</td>
                    <td>${oferta.clave_de_docente}</td>
                    <td>${oferta.semestre}°</td>
                    <td>${oferta.grupo}</td>
                    <td>${oferta.turno}</td>
                </tr>
            `;
        });
    }

    $("#cuerpoOfertas").html(html);
    actualizarContadores(null, ofertas.length);
    verificarHabilitarGuardar();
}

// Función para actualizar contadores
function actualizarContadores(alumnos = null, ofertas = null) {
    if (alumnos !== null) {
        $("#contadorAlumnos").text(alumnos);
    }
    if (ofertas !== null) {
        $("#contadorOfertas").text(ofertas);
    }
}

// Función para verificar si se debe habilitar el botón guardar
function verificarHabilitarGuardar() {
    const cantidadAlumnos = parseInt($("#contadorAlumnos").text());
    const cantidadOfertas = parseInt($("#contadorOfertas").text());

    const habilitar = cantidadAlumnos > 0 && cantidadOfertas > 0;
    $("#btnGuardarHorario").prop('disabled', !habilitar);
}

// Función para limpiar las tablas
function limpiarTablas() {
    $("#cuerpoAlumnos").html(`
        <tr>
            <td colspan="4" class="empty-state">
                <i class="fas fa-search fa-2x mb-2"></i>
                <p class="mb-0">Seleccione carrera, semestre y grupo para mostrar alumnos</p>
            </td>
        </tr>
    `);

    $("#cuerpoOfertas").html(`
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-clipboard fa-2x mb-2"></i>
                <p class="mb-0">Seleccione carrera, semestre y grupo para mostrar ofertas</p>
            </td>
        </tr>
    `);

    actualizarContadores(0, 0);
    $("#btnGuardarHorario").prop('disabled', true);
}

// Función para limpiar errores
function limpiarErrores() {
    $(".error-message").hide();
    $(".form-select, .form-control").removeClass('error-field');
}

// Función para mostrar error en un campo específico
function mostrarError(campo, mensaje) {
    $(`#${campo}`).addClass('error-field');
    $(`#error${campo.charAt(0).toUpperCase() + campo.slice(1)}`).text(mensaje).show();
}

// Función para guardar horarios
function guardarHorarios() {
    // Validar formulario antes de continuar
  if (!validarFormulario()) {
    return;
  }

  // Obtener datos del formulario
  const carrera = document.getElementById("claveCarrera").value.trim();
  const semestre = document.getElementById("semestre").value.trim();
  const grupo = document.getElementById("grupo").value.trim();
  const turno = document.getElementById("turno").value.trim();

  // Validar que se hayan obtenido datos
  if (!carrera || !semestre || !grupo || !turno) {
    mostrarFaltaDatos("Por favor, complete todos los campos y asegúrese de haber generado los horarios.");
    return;
  }

  // Armar el objeto que se enviará
  const datos = {
    claveCarrera: carrera,
    semestre: semestre,
    grupo: grupo,
    turno: turno,
  };

  const json = JSON.stringify(datos);
  const url = "../../Controlador/Intermediarios/Horario/AgregarHorario.php";

  // Deshabilitar botón mientras se procesa
  $("#btnGuardarHorario").prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Guardando...');

  console.log("Datos JSON enviados:", json); 

  // Enviar solicitud POST
  $.post(url, json, function (response, status) {
    if (response.success) {
      mostrarDatosGuardados(
        `Horarios guardados correctamente para la carrera ${carrera}, semestre ${semestre}, grupo ${grupo}, turno ${turno}.`,
        function () {
          option("horario", ""); // Recarga la vista o redirige
        }
      );
    } else {
      mostrarErrorCaptura(response.mensaje);
      $("#btnGuardarHorario").prop('disabled', false).html('Guardar');
    }
  }, "json").fail(function (xhr, status, error) {
    console.error("Error en la solicitud POST Guardar Horario:", xhr.responseText);
    mostrarErrorCaptura("No se pudo conectar con el servidor. Inténtelo más tarde.");
    $("#btnGuardarHorario").prop('disabled', false).html('Guardar');
  });

}

// Función para validar el formulario antes de guardar
function validarFormulario() {
    let valido = true;
    limpiarErrores();

    if ($("#claveCarrera").val() === "") {
        mostrarError("claveCarrera", "Debe seleccionar una carrera");
        valido = false;
    }

    if ($("#semestre").val() === "") {
        mostrarError("semestre", "Debe seleccionar un semestre");
        valido = false;
    }

    if ($("#grupo").val() === "") {
        mostrarError("grupo", "Debe seleccionar un grupo");
        valido = false;
    }

    if ($("#turno").val() === "") {
        mostrarError("turno", "Debe seleccionar un turno");
        valido = false;
    }

    const cantidadAlumnos = parseInt($("#contadorAlumnos").text());
    const cantidadOfertas = parseInt($("#contadorOfertas").text());

    if (cantidadAlumnos === 0) {
        mostrarError("claveCarrera", "No hay alumnos disponibles para la selección");
        valido = false;
    }

    if (cantidadOfertas === 0) {
        mostrarError("claveCarrera", "No hay ofertas disponibles para la selección");
        valido = false;
    }

    return valido;
}

// Función para obtener alumnos de la tabla
function obtenerAlumnosTabla() {
    const alumnos = [];
    $("#tablaAlumnos tbody tr").each(function () {
        const fila = $(this);
        if (!fila.find('.empty-state').length) {
            alumnos.push({
                numeroControl: fila.find('td:eq(0)').text(),
                nombre: fila.find('td:eq(1)').text(),
                semestre: fila.find('td:eq(2)').text(),
                estado: fila.find('td:eq(3)').text()
            });
        }
    });
    return alumnos;
}

// Función para obtener ofertas de la tabla
function obtenerOfertasTabla() {
    const ofertas = [];
    $("#tablaOfertas tbody tr").each(function () {
        const fila = $(this);
        if (!fila.find('.empty-state').length) {
            ofertas.push({
                idOferta: fila.find('td:eq(0)').text(),
                claveMateria: fila.find('td:eq(1)').text(),
                nombreMateria: fila.find('td:eq(2)').text(),
                docente: fila.find('td:eq(3)').text(),
                semestre: fila.find('td:eq(4)').text(),
                grupo: fila.find('td:eq(5)').text(),
                turno: fila.find('td:eq(6)').text()
            });
        }
    });
    return ofertas;
}

// Función para cancelar y limpiar el formulario
function cancelarFormulario() {
    // Limpiar selects
    $("#claveCarrera").val("");
    $("#semestre").val("");
    $("#grupo").val("");
    $("#turno").val("");

    // Limpiar errores
    limpiarErrores();

    // Limpiar tablas
    limpiarTablas();

    // Restaurar botón guardar
    $("#btnGuardarHorario").prop('disabled', true).html('<i class="fas fa-save me-2"></i>Guardar Horarios');

    // Aquí podrías cerrar el formulario o redirigir
    // Por ejemplo: loadFormHorario('lista', '');
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito(mensaje) {
    // Aquí implementarías tu sistema de notificaciones
    // Por ahora uso alert simple
    alert(mensaje);
}

// ========== FUNCIONES PARA MODIFICAR HORARIOS ==========

// Función para inicializar el formulario de modificar horarios
function inicializarFormularioModificarHorario() {
    // Cargar información del período activo
    cargarPeriodoActivo();

    // Configurar event listeners para los selects
    configurarEventListenersModificarHorario();

    // Limpiar contadores
    actualizarContadoresModificacion(0, 0, 0);

    // Deshabilitar botones inicialmente
    $("#btnGuardarModificacion").prop('disabled', true);
    $("#btnAgregarOfertas").prop('disabled', true);
    $("#btnQuitarOfertas").prop('disabled', true);
}

// Función para configurar event listeners del formulario de modificación
function configurarEventListenersModificarHorario() {
    // Event listeners para cambios en selects
    $("#claveCarrera").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupoModificacion();
        } else {
            limpiarTablasModificacion();
        }
    });

    $("#semestre").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupoModificacion();
        } else {
            limpiarTablasModificacion();
        }
    });

    $("#grupo").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupoModificacion();
        } else {
            limpiarTablasModificacion();
        }
    });

    // Event listener para cambio de turno
    $("#turno").off('change').on('change', function () {
        limpiarErrores();
        if (validarSeleccionCompleta()) {
            cargarDatosGrupoModificacion();
        } else {
            limpiarTablasModificacion();
        }
    });

    // Event listeners para checkboxes
    $("#selectAllAsignadas").off('change').on('change', function () {
        const checked = $(this).is(':checked');
        $("#tablaOfertasAsignadas tbody input[type='checkbox']").prop('checked', checked);
        verificarBotonesModificacion();
    });

    $("#selectAllDisponibles").off('change').on('change', function () {
        const checked = $(this).is(':checked');
        $("#tablaOfertasDisponibles tbody input[type='checkbox']").prop('checked', checked);
        verificarBotonesModificacion();
    });

    // Event listeners para botones
    $("#btnAgregarOfertas").off('click').on('click', function () {
        agregarOfertasSeleccionadas();
    });

    $("#btnQuitarOfertas").off('click').on('click', function () {
        quitarOfertasSeleccionadas();
    });

    $("#btnGuardarModificacion").off('click').on('click', function () {
        guardarModificacionHorarios();
    });

    // Event listener para checkboxes dinámicos
    $(document).off('change', '#tablaOfertasAsignadas tbody input[type="checkbox"]')
        .on('change', '#tablaOfertasAsignadas tbody input[type="checkbox"]', function () {
            verificarBotonesModificacion();
        });

    $(document).off('change', '#tablaOfertasDisponibles tbody input[type="checkbox"]')
        .on('change', '#tablaOfertasDisponibles tbody input[type="checkbox"]', function () {
            verificarBotonesModificacion();
        });
}

// Función para cargar datos del grupo para modificación
function cargarDatosGrupoModificacion() {
    const carrera = $("#claveCarrera").val();
    const semestre = $("#semestre").val();
    const grupo = $("#grupo").val();

    if (!validarSeleccionCompleta()) {
        return;
    }

    // Mostrar indicadores de carga
    mostrarCargandoAlumnosConHorarios();
    mostrarCargandoOfertasAsignadas();
    mostrarCargandoOfertasDisponibles();

    // Cargar datos
    cargarAlumnosConHorarios(carrera, semestre, grupo);
    cargarOfertasAsignadas(carrera, semestre, grupo);
    cargarOfertasDisponiblesParaAgregar(carrera, semestre, grupo);
}

// Función para cargar alumnos que tienen horarios registrados
function cargarAlumnosConHorarios(carrera, semestre, grupo) {
    // Aquí harías la llamada al backend
    // Por ahora simulo datos
    setTimeout(() => {
        const alumnos = [
            {
                numeroControl: '20240001',
                nombre: 'García López, Juan Carlos',
                semestre: semestre,
                ofertasAsignadas: 5,
                estado: 'Activo'
            },
            {
                numeroControl: '20240002',
                nombre: 'Martínez Rodríguez, María Elena',
                semestre: semestre,
                ofertasAsignadas: 5,
                estado: 'Activo'
            },
            {
                numeroControl: '20240003',
                nombre: 'Hernández Pérez, Luis Miguel',
                semestre: semestre,
                ofertasAsignadas: 5,
                estado: 'Activo'
            }
        ];

        mostrarAlumnosConHorarios(alumnos);
    }, 500);
}

// Función para cargar ofertas ya asignadas en horarios
function cargarOfertasAsignadas(carrera, semestre, grupo) {
    // Aquí harías la llamada al backend
    // Por ahora simulo datos
    setTimeout(() => {
        const ofertas = [
            {
                idOferta: '001',
                claveMateria: 'SCC-1008',
                nombreMateria: 'Sistemas de Base de Datos',
                docente: 'Dr. Roberto Sánchez',
                semestre: semestre,
                grupo: grupo,
                turno: 'M'
            },
            {
                idOferta: '002',
                claveMateria: 'SCC-1010',
                nombreMateria: 'Programación Orientada a Objetos',
                docente: 'Ing. Ana María Flores',
                semestre: semestre,
                grupo: grupo,
                turno: 'M'
            },
            {
                idOferta: '003',
                claveMateria: 'ACF-0901',
                nombreMateria: 'Cálculo Diferencial',
                docente: 'M.C. José Luis Torres',
                semestre: semestre,
                grupo: grupo,
                turno: 'M'
            }
        ];

        mostrarOfertasAsignadas(ofertas);
    }, 700);
}

// Función para cargar ofertas disponibles para agregar
function cargarOfertasDisponiblesParaAgregar(carrera, semestre, grupo) {
    // Aquí harías la llamada al backend
    // Por ahora simulo datos
    setTimeout(() => {
        const ofertas = [
            {
                idOferta: '004',
                claveMateria: 'SCD-1011',
                nombreMateria: 'Estructura de Datos',
                docente: 'Ing. Carmen Díaz',
                semestre: semestre,
                grupo: grupo,
                turno: 'M'
            },
            {
                idOferta: '005',
                claveMateria: 'MAC-1105',
                nombreMateria: 'Álgebra Lineal',
                docente: 'M.C. Fernando Ruiz',
                semestre: semestre,
                grupo: grupo,
                turno: 'V'
            }
        ];

        mostrarOfertasDisponibles(ofertas);
    }, 900);
}

// Función para mostrar indicadores de carga
function mostrarCargandoAlumnosConHorarios() {
    $("#cuerpoAlumnos").html(`
        <tr>
            <td colspan="5" class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x mb-2"></i>
                <p class="mb-0">Cargando alumnos con horarios...</p>
            </td>
        </tr>
    `);
}

function mostrarCargandoOfertasAsignadas() {
    $("#cuerpoOfertasAsignadas").html(`
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x mb-2"></i>
                <p class="mb-0">Cargando ofertas asignadas...</p>
            </td>
        </tr>
    `);
}

function mostrarCargandoOfertasDisponibles() {
    $("#cuerpoOfertasDisponibles").html(`
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-spinner fa-spin fa-2x mb-2"></i>
                <p class="mb-0">Cargando ofertas disponibles...</p>
            </td>
        </tr>
    `);
}

// Función para mostrar alumnos con horarios
function mostrarAlumnosConHorarios(alumnos) {
    let html = '';

    if (alumnos.length === 0) {
        html = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-user-slash fa-2x mb-2"></i>
                    <p class="mb-0">No hay alumnos con horarios registrados para esta selección</p>
                </td>
            </tr>
        `;
    } else {
        alumnos.forEach(alumno => {
            const estadoBadge = alumno.estado === 'Activo'
                ? '<span class="badge bg-success">Activo</span>'
                : '<span class="badge bg-danger">Inactivo</span>';

            html += `
                <tr>
                    <td>${alumno.numeroControl}</td>
                    <td>${alumno.nombre}</td>
                    <td>${alumno.semestre}°</td>
                    <td><span class="badge bg-info">${alumno.ofertasAsignadas}</span></td>
                    <td>${estadoBadge}</td>
                </tr>
            `;
        });
    }

    $("#cuerpoAlumnos").html(html);
    actualizarContadoresModificacion(alumnos.length, null, null);
    verificarHabilitarGuardarModificacion();
}

// Función para mostrar ofertas asignadas
function mostrarOfertasAsignadas(ofertas) {
    let html = '';

    if (ofertas.length === 0) {
        html = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-clipboard fa-2x mb-2"></i>
                    <p class="mb-0">No hay ofertas asignadas para esta selección</p>
                </td>
            </tr>
        `;
    } else {
        ofertas.forEach(oferta => {
            html += `
                <tr>
                    <td><input type="checkbox" class="form-check-input" value="${oferta.idOferta}"></td>
                    <td>${oferta.idOferta}</td>
                    <td>${oferta.claveMateria}</td>
                    <td>${oferta.nombreMateria}</td>
                    <td>${oferta.docente}</td>
                    <td>${oferta.grupo}</td>
                    <td>${oferta.turno}</td>
                </tr>
            `;
        });
    }

    $("#cuerpoOfertasAsignadas").html(html);
    $("#selectAllAsignadas").prop('checked', false);
    actualizarContadoresModificacion(null, ofertas.length, null);
    verificarHabilitarGuardarModificacion();
    verificarBotonesModificacion();
}

// Función para mostrar ofertas disponibles
function mostrarOfertasDisponibles(ofertas) {
    let html = '';

    if (ofertas.length === 0) {
        html = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p class="mb-0">No hay ofertas disponibles para agregar</p>
                </td>
            </tr>
        `;
    } else {
        ofertas.forEach(oferta => {
            html += `
                <tr>
                    <td><input type="checkbox" class="form-check-input" value="${oferta.idOferta}"></td>
                    <td>${oferta.idOferta}</td>
                    <td>${oferta.claveMateria}</td>
                    <td>${oferta.nombreMateria}</td>
                    <td>${oferta.docente}</td>
                    <td>${oferta.grupo}</td>
                    <td>${oferta.turno}</td>
                </tr>
            `;
        });
    }

    $("#cuerpoOfertasDisponibles").html(html);
    $("#selectAllDisponibles").prop('checked', false);
    actualizarContadoresModificacion(null, null, ofertas.length);
    verificarBotonesModificacion();
}

// Función para actualizar contadores de modificación
function actualizarContadoresModificacion(alumnos = null, ofertasAsignadas = null, ofertasDisponibles = null) {
    if (alumnos !== null) {
        $("#contadorAlumnos").text(alumnos);
    }
    if (ofertasAsignadas !== null) {
        $("#contadorOfertasAsignadas").text(ofertasAsignadas);
    }
    if (ofertasDisponibles !== null) {
        $("#contadorOfertasDisponibles").text(ofertasDisponibles);
    }
}

// Función para verificar botones de agregar/quitar ofertas
function verificarBotonesModificacion() {
    const ofertasAsignadasSeleccionadas = $("#tablaOfertasAsignadas tbody input[type='checkbox']:checked").length;
    const ofertasDisponiblesSeleccionadas = $("#tablaOfertasDisponibles tbody input[type='checkbox']:checked").length;

    $("#btnQuitarOfertas").prop('disabled', ofertasAsignadasSeleccionadas === 0);
    $("#btnAgregarOfertas").prop('disabled', ofertasDisponiblesSeleccionadas === 0);
}

// Función para verificar si se debe habilitar el botón guardar modificación
function verificarHabilitarGuardarModificacion() {
    const cantidadAlumnos = parseInt($("#contadorAlumnos").text());
    const cantidadOfertasAsignadas = parseInt($("#contadorOfertasAsignadas").text());

    const habilitar = cantidadAlumnos > 0 && cantidadOfertasAsignadas > 0;
    $("#btnGuardarModificacion").prop('disabled', !habilitar);
}

// Función para agregar ofertas seleccionadas
function agregarOfertasSeleccionadas() {
    const ofertasSeleccionadas = [];
    $("#tablaOfertasDisponibles tbody input[type='checkbox']:checked").each(function () {
        const fila = $(this).closest('tr');
        ofertasSeleccionadas.push({
            idOferta: $(this).val(),
            claveMateria: fila.find('td:eq(2)').text(),
            nombreMateria: fila.find('td:eq(3)').text(),
            docente: fila.find('td:eq(4)').text(),
            grupo: fila.find('td:eq(5)').text(),
            turno: fila.find('td:eq(6)').text()
        });
    });

    if (ofertasSeleccionadas.length === 0) {
        mostrarMensajeExito("No hay ofertas seleccionadas para agregar");
        return;
    }

    // Mover ofertas de disponibles a asignadas
    moverOfertasAAsignadas(ofertasSeleccionadas);

    mostrarMensajeExito(`${ofertasSeleccionadas.length} oferta(s) agregada(s) temporalmente`);
}

// Función para quitar ofertas seleccionadas
function quitarOfertasSeleccionadas() {
    const ofertasSeleccionadas = [];
    $("#tablaOfertasAsignadas tbody input[type='checkbox']:checked").each(function () {
        const fila = $(this).closest('tr');
        ofertasSeleccionadas.push({
            idOferta: $(this).val(),
            claveMateria: fila.find('td:eq(2)').text(),
            nombreMateria: fila.find('td:eq(3)').text(),
            docente: fila.find('td:eq(4)').text(),
            grupo: fila.find('td:eq(5)').text(),
            turno: fila.find('td:eq(6)').text()
        });
    });

    if (ofertasSeleccionadas.length === 0) {
        mostrarMensajeExito("No hay ofertas seleccionadas para quitar");
        return;
    }

    // Mover ofertas de asignadas a disponibles
    moverOfertasADisponibles(ofertasSeleccionadas);

    mostrarMensajeExito(`${ofertasSeleccionadas.length} oferta(s) quitada(s) temporalmente`);
}

// Función para mover ofertas a asignadas
function moverOfertasAAsignadas(ofertas) {
    ofertas.forEach(oferta => {
        // Agregar a tabla asignadas
        const nuevoHtml = `
            <tr>
                <td><input type="checkbox" class="form-check-input" value="${oferta.idOferta}"></td>
                <td>${oferta.idOferta}</td>
                <td>${oferta.claveMateria}</td>
                <td>${oferta.nombreMateria}</td>
                <td>${oferta.docente}</td>
                <td>${oferta.grupo}</td>
                <td>${oferta.turno}</td>
            </tr>
        `;

        if ($("#tablaOfertasAsignadas tbody .empty-state").length > 0) {
            $("#cuerpoOfertasAsignadas").html(nuevoHtml);
        } else {
            $("#cuerpoOfertasAsignadas").append(nuevoHtml);
        }

        // Quitar de tabla disponibles
        $(`#tablaOfertasDisponibles tbody input[value="${oferta.idOferta}"]`).closest('tr').remove();
    });

    // Actualizar contadores
    const nuevasAsignadas = $("#tablaOfertasAsignadas tbody tr").not('.empty-state').length;
    const nuevasDisponibles = $("#tablaOfertasDisponibles tbody tr").not('.empty-state').length;

    if (nuevasDisponibles === 0) {
        $("#cuerpoOfertasDisponibles").html(`
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p class="mb-0">No hay ofertas disponibles para agregar</p>
                </td>
            </tr>
        `);
    }

    actualizarContadoresModificacion(null, nuevasAsignadas, nuevasDisponibles);
    verificarBotonesModificacion();
    verificarHabilitarGuardarModificacion();
}

// Función para mover ofertas a disponibles
function moverOfertasADisponibles(ofertas) {
    ofertas.forEach(oferta => {
        // Agregar a tabla disponibles
        const nuevoHtml = `
            <tr>
                <td><input type="checkbox" class="form-check-input" value="${oferta.idOferta}"></td>
                <td>${oferta.idOferta}</td>
                <td>${oferta.claveMateria}</td>
                <td>${oferta.nombreMateria}</td>
                <td>${oferta.docente}</td>
                <td>${oferta.grupo}</td>
                <td>${oferta.turno}</td>
            </tr>
        `;

        if ($("#tablaOfertasDisponibles tbody .empty-state").length > 0) {
            $("#cuerpoOfertasDisponibles").html(nuevoHtml);
        } else {
            $("#cuerpoOfertasDisponibles").append(nuevoHtml);
        }

        // Quitar de tabla asignadas
        $(`#tablaOfertasAsignadas tbody input[value="${oferta.idOferta}"]`).closest('tr').remove();
    });

    // Actualizar contadores
    const nuevasAsignadas = $("#tablaOfertasAsignadas tbody tr").not('.empty-state').length;
    const nuevasDisponibles = $("#tablaOfertasDisponibles tbody tr").not('.empty-state').length;

    if (nuevasAsignadas === 0) {
        $("#cuerpoOfertasAsignadas").html(`
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-clipboard fa-2x mb-2"></i>
                    <p class="mb-0">No hay ofertas asignadas para esta selección</p>
                </td>
            </tr>
        `);
    }

    actualizarContadoresModificacion(null, nuevasAsignadas, nuevasDisponibles);
    verificarBotonesModificacion();
    verificarHabilitarGuardarModificacion();
}

// Función para guardar modificaciones de horarios
function guardarModificacionHorarios() {
    if (!validarFormularioModificacion()) {
        return;
    }

    const datos = {
        carrera: $("#claveCarrera").val(),
        semestre: $("#semestre").val(),
        grupo: $("#grupo").val(),
        alumnos: obtenerAlumnosTablaModificacion(),
        ofertasFinales: obtenerOfertasAsignadasTabla()
    };

    // Deshabilitar botón mientras se procesa
    $("#btnGuardarModificacion").prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Guardando...');

    mostrarDatosGuardados(
        `Horarios guardados correctamente para la carrera ${datos.carrera}, semestre ${datos.semestre}, grupo ${datos.grupo}.`,
        function () {
            option("horario", "");
        }
    );
}

// Función para validar formulario de modificación
function validarFormularioModificacion() {
    let valido = true;
    limpiarErrores();

    if ($("#claveCarrera").val() === "") {
        mostrarError("claveCarrera", "Debe seleccionar una carrera");
        valido = false;
    }

    if ($("#semestre").val() === "") {
        mostrarError("semestre", "Debe seleccionar un semestre");
        valido = false;
    }

    if ($("#grupo").val() === "") {
        mostrarError("grupo", "Debe seleccionar un grupo");
        valido = false;
    }

    if ($("#turno").val() === "") {
        mostrarError("turno", "Debe seleccionar un turno");
        valido = false;
    }

    const cantidadAlumnos = parseInt($("#contadorAlumnos").text());
    const cantidadOfertasAsignadas = parseInt($("#contadorOfertasAsignadas").text());

    if (cantidadAlumnos === 0) {
        mostrarError("claveCarrera", "No hay alumnos con horarios para la selección");
        valido = false;
    }

    if (cantidadOfertasAsignadas === 0) {
        mostrarError("claveCarrera", "Debe tener al menos una oferta asignada");
        valido = false;
    }

    return valido;
}

// Función para obtener alumnos de la tabla de modificación
function obtenerAlumnosTablaModificacion() {
    const alumnos = [];
    $("#tablaAlumnos tbody tr").each(function () {
        const fila = $(this);
        if (!fila.find('.empty-state').length) {
            alumnos.push({
                numeroControl: fila.find('td:eq(0)').text(),
                nombre: fila.find('td:eq(1)').text(),
                semestre: fila.find('td:eq(2)').text(),
                estado: fila.find('td:eq(4)').text()
            });
        }
    });
    return alumnos;
}

// Función para obtener ofertas asignadas de la tabla
function obtenerOfertasAsignadasTabla() {
    const ofertas = [];
    $("#tablaOfertasAsignadas tbody tr").each(function () {
        const fila = $(this);
        if (!fila.find('.empty-state').length) {
            ofertas.push({
                idOferta: fila.find('td:eq(1)').text(),
                claveMateria: fila.find('td:eq(2)').text(),
                nombreMateria: fila.find('td:eq(3)').text(),
                docente: fila.find('td:eq(4)').text(),
                grupo: fila.find('td:eq(5)').text(),
                turno: fila.find('td:eq(6)').text()
            });
        }
    });
    return ofertas;
}

// Función para limpiar las tablas de modificación
function limpiarTablasModificacion() {
    $("#cuerpoAlumnos").html(`
        <tr>
            <td colspan="5" class="empty-state">
                <i class="fas fa-search fa-2x mb-2"></i>
                <p class="mb-0">Seleccione carrera, semestre y grupo para mostrar alumnos con horarios</p>
            </td>
        </tr>
    `);

    $("#cuerpoOfertasAsignadas").html(`
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-clipboard fa-2x mb-2"></i>
                <p class="mb-0">Seleccione carrera, semestre y grupo para mostrar ofertas asignadas</p>
            </td>
        </tr>
    `);

    $("#cuerpoOfertasDisponibles").html(`
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-search fa-2x mb-2"></i>
                <p class="mb-0">Seleccione carrera, semestre y grupo para mostrar ofertas disponibles</p>
            </td>
        </tr>
    `);

    actualizarContadoresModificacion(0, 0, 0);
    $("#btnGuardarModificacion").prop('disabled', true);
    $("#btnAgregarOfertas").prop('disabled', true);
    $("#btnQuitarOfertas").prop('disabled', true);
    $("#selectAllAsignadas").prop('checked', false);
    $("#selectAllDisponibles").prop('checked', false);
}
