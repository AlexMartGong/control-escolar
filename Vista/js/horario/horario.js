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
    // Aquí harías la llamada al backend para obtener el período activo
    // Por ahora simulo la información
    $("#periodoInfo").text('ENE-JUN 2024 (Estado: Activo, Ajustes hasta: 15/02/2024)');
}

// Función para cargar carreras en el formulario de agregar horario
function cargarCarrerasfrmAgr() {
    // Limpiar select
    $("#claveCarrera").empty().append('<option value="">Seleccione una carrera...</option>');

    // Aquí harías la llamada al backend para obtener las carreras
    // Por ahora simulo algunas carreras
    const carreras = [
        {value: 'IINF-2010-220', text: 'IINF-2010-220 - Ingeniería Informática'},
        {value: 'IIND-2010-221', text: 'IIND-2010-221 - Ingeniería Industrial'},
        {value: 'IELC-2010-222', text: 'IELC-2010-222 - Ingeniería Electrónica'}
    ];

    carreras.forEach(carrera => {
        $("#claveCarrera").append(`<option value="${carrera.value}">${carrera.text}</option>`);
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

    return carrera !== "" && semestre !== "" && grupo !== "";
}

// Función para cargar datos del grupo (alumnos y ofertas)
function cargarDatosGrupo() {
    const carrera = $("#claveCarrera").val();
    const semestre = $("#semestre").val();
    const grupo = $("#grupo").val();

    if (!validarSeleccionCompleta()) {
        return;
    }

    // Mostrar indicadores de carga
    mostrarCargandoAlumnos();
    mostrarCargandoOfertas();

    // Cargar alumnos
    cargarAlumnosGrupo(carrera, semestre, grupo);

    // Cargar ofertas
    cargarOfertasGrupo(carrera, semestre, grupo);
}

// Función para cargar alumnos del grupo
function cargarAlumnosGrupo(carrera, semestre, grupo) {
    // Aquí harías la llamada al backend
    // Por ahora simulo datos
    setTimeout(() => {
        const alumnos = [
            {numeroControl: '20240001', nombre: 'García López, Juan Carlos', semestre: semestre, estado: 'Activo'},
            {
                numeroControl: '20240002',
                nombre: 'Martínez Rodríguez, María Elena',
                semestre: semestre,
                estado: 'Activo'
            },
            {numeroControl: '20240003', nombre: 'Hernández Pérez, Luis Miguel', semestre: semestre, estado: 'Activo'}
        ];

        mostrarAlumnos(alumnos);
    }, 500);
}

// Función para cargar ofertas del grupo
function cargarOfertasGrupo(carrera, semestre, grupo) {
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

        mostrarOfertas(ofertas);
    }, 500);
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
                    <td>${alumno.numeroControl}</td>
                    <td>${alumno.nombre}</td>
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
                    <td>${oferta.idOferta}</td>
                    <td>${oferta.claveMateria}</td>
                    <td>${oferta.nombreMateria}</td>
                    <td>${oferta.docente}</td>
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
    if (!validarFormulario()) {
        return;
    }

    const datos = {
        carrera: $("#claveCarrera").val(),
        semestre: $("#semestre").val(),
        grupo: $("#grupo").val(),
        alumnos: obtenerAlumnosTabla(),
        ofertas: obtenerOfertasTabla()
    };

    // Deshabilitar botón mientras se procesa
    $("#btnGuardarHorario").prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Guardando...');

    mostrarDatosGuardados(
        `Horarios guardados correctamente para la carrera ${datos.carrera}, semestre ${datos.semestre}, grupo ${datos.grupo}.`,
        function () {
            option("horario", "");
        }
    );
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
