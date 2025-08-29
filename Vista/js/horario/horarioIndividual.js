// Encapsular en IIFE para evitar conflictos de variables globales
(function () {
    'use strict';

    // Variables locales del módulo
    let alumnoActual = null;
    let ofertasAsignadasOriginales = [];
    let ofertasAsignadasActuales = [];
    let ofertasDisponibles = [];
    let cambiosDetectados = false;

    // Datos de prueba
    const DATOS_PRUEBA = {
        alumno: {
            noControl: "20401234",
            nombre: "Juan Carlos",
            apellidoPaterno: "García",
            apellidoMaterno: "López",
            semestre: 6,
            grupo: "A",
            claveCarrera: "ISC",
            nombreCarrera: "Ingeniería en Sistemas Computacionales",
            turno: "Matutino",
            estado: "Activo"
        },
        ofertasAsignadas: [
            {
                idOferta: 101,
                claveMateria: "SCC-1018",
                nombreMateria: "Programación Orientada a Objetos",
                nombreDocente: "Dr. María Fernández",
                horario: "Lun-Mie 08:00-10:00"
            },
            {
                idOferta: 102,
                claveMateria: "SCG-1009",
                nombreMateria: "Matemáticas Discretas",
                nombreDocente: "Ing. Roberto Sánchez",
                horario: "Mar-Jue 10:00-12:00"
            },
            {
                idOferta: 103,
                claveMateria: "ACA-0909",
                nombreMateria: "Taller de Ética",
                nombreDocente: "Lic. Ana Torres",
                horario: "Vie 14:00-16:00"
            }
        ],
        ofertasDisponibles: [
            {
                idOferta: 104,
                claveMateria: "SCD-1020",
                nombreMateria: "Fundamentos de Base de Datos",
                nombreDocente: "M.C. Carlos Ruiz",
                horario: "Lun-Vie 12:00-14:00"
            },
            {
                idOferta: 105,
                claveMateria: "SCH-1024",
                nombreMateria: "Fundamentos de Telecomunicaciones",
                nombreDocente: "Ing. Laura Méndez",
                horario: "Mar-Jue 14:00-16:00"
            },
            {
                idOferta: 106,
                claveMateria: "SCC-1017",
                nombreMateria: "Programación Web",
                nombreDocente: "M.C. Fernando Vega",
                horario: "Lun-Mie 16:00-18:00"
            },
            {
                idOferta: 107,
                claveMateria: "AEC-1058",
                nombreMateria: "Probabilidad y Estadística",
                nombreDocente: "Dr. Patricia Morales",
                horario: "Mar-Jue 08:00-10:00"
            }
        ],
        periodo: {
            nombre: "Agosto - Diciembre 2024",
            fechaInicio: "2024-08-26",
            fechaFin: "2024-12-20"
        }
    };

    // Inicializar página
    $(document).ready(function () {
        inicializarEventos();
        cargarInformacionPeriodo();
    });

    // Configurar eventos
    function inicializarEventos() {
        // Evento para buscar alumno
        $('#btnBuscarAlumno').click(buscarAlumno);
        $('#noControlBusqueda').keypress(function (e) {
            if (e.which === 13) { // Enter
                buscarAlumno();
            }
        });

        // Eventos de selección múltiple
        $('#selectAllAsignadas').change(function () {
            const checked = $(this).is(':checked');
            $('#cuerpoOfertasAsignadas input[type="checkbox"]').prop('checked', checked);
            actualizarEstadoBotones();
        });

        $('#selectAllDisponibles').change(function () {
            const checked = $(this).is(':checked');
            $('#cuerpoOfertasDisponibles input[type="checkbox"]').prop('checked', checked);
            actualizarEstadoBotones();
        });

        // Eventos de botones de acción
        $('#btnQuitarOfertas').click(quitarOfertasSeleccionadas);
        $('#btnAgregarOfertas').click(agregarOfertasSeleccionadas);
        $('#btnGuardarModificacion').click(guardarModificaciones);

        // Detectar cambios en checkboxes
        $(document).on('change', '#cuerpoOfertasAsignadas input[type="checkbox"], #cuerpoOfertasDisponibles input[type="checkbox"]', function () {
            actualizarEstadoBotones();
        });
    }

    function cargarInformacionPeriodo() {
        $('#periodoInfo').text(`${DATOS_PRUEBA.periodo.nombre} (${DATOS_PRUEBA.periodo.fechaInicio} - ${DATOS_PRUEBA.periodo.fechaFin})`);

    }

    // Buscar alumno por número de control
    function buscarAlumno() {
        const noControl = $('#noControlBusqueda').val().trim();

        if (!noControl) {
            mostrarError('errorNoControl', 'Ingrese un número de control');
            return;
        }

        limpiarErrores();
        mostrarCargando(true);

        // Simular delay de red
        setTimeout(() => {
            mostrarCargando(false);

            // Verificar si es el número de control de prueba
            if (noControl === DATOS_PRUEBA.alumno.noControl) {
                alumnoActual = DATOS_PRUEBA.alumno;
                mostrarInformacionAlumno(DATOS_PRUEBA.alumno);
                cargarOfertasAsignadas();
                cargarOfertasDisponibles();
                mostrarMensaje('success', 'Alumno encontrado correctamente');
            } else {
                mostrarError('errorNoControl', `Alumno no encontrado. Pruebe con: ${DATOS_PRUEBA.alumno.noControl}`);
                limpiarFormulario();
            }
        }, 1000);

    }

    // Mostrar información del alumno
    function mostrarInformacionAlumno(alumno) {
        $('#alumnoNoControl').text(alumno.noControl);
        $('#alumnoNombre').text(`${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`);
        $('#alumnoSemestre').text(`${alumno.semestre}°`);
        $('#alumnoGrupo').text(alumno.grupo);
        $('#alumnoCarrera').text(alumno.nombreCarrera);
        $('#alumnoTurno').text(alumno.turno);

        // Configurar badge de estado
        const badge = $('#alumnoEstado');
        badge.removeClass('bg-success bg-warning bg-danger');
        if (alumno.estado === 'Activo') {
            badge.addClass('bg-success').text('Activo');
        } else {
            badge.addClass('bg-danger').text(alumno.estado);
        }

        $('#seccionAlumno').show();
    }

    // Cargar ofertas asignadas al alumno
    function cargarOfertasAsignadas() {
        // Simular datos de prueba
        ofertasAsignadasOriginales = [...DATOS_PRUEBA.ofertasAsignadas];
        ofertasAsignadasActuales = [...DATOS_PRUEBA.ofertasAsignadas];
        mostrarOfertasAsignadas(DATOS_PRUEBA.ofertasAsignadas);
        $('#seccionOfertasAsignadas').show();
    }

    // Cargar ofertas disponibles para el alumno
    function cargarOfertasDisponibles() {
        // Simular datos de prueba
        ofertasDisponibles = [...DATOS_PRUEBA.ofertasDisponibles];
        mostrarOfertasDisponibles(DATOS_PRUEBA.ofertasDisponibles);
        $('#seccionOfertasDisponibles').show();
    }

    // Mostrar ofertas asignadas en tabla
    function mostrarOfertasAsignadas(ofertas) {
        const tbody = $('#cuerpoOfertasAsignadas');
        tbody.empty();

        if (ofertas.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-clipboard fa-2x mb-2"></i>
                        <p class="mb-0">El alumno no tiene ofertas asignadas</p>
                    </td>
                </tr>
            `);
        } else {
            ofertas.forEach(oferta => {
                tbody.append(`
                    <tr>
                        <td>
                            <input type="checkbox" class="form-check-input" value="${oferta.idOferta}">
                        </td>
                        <td>${oferta.idOferta}</td>
                        <td>${oferta.claveMateria}</td>
                        <td>${oferta.nombreMateria}</td>
                        <td>${oferta.nombreDocente}</td>
                        <td class="text-center">
                            <small>${oferta.horario || 'N/A'}</small>
                        </td>
                    </tr>
                `);
            });
        }

        $('#contadorOfertasAsignadas').text(ofertas.length);
        $('#selectAllAsignadas').prop('checked', false);
        actualizarEstadoBotones();
    }

    // Mostrar ofertas disponibles en tabla
    function mostrarOfertasDisponibles(ofertas) {
        const tbody = $('#cuerpoOfertasDisponibles');
        tbody.empty();

        if (ofertas.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-search fa-2x mb-2"></i>
                        <p class="mb-0">No hay ofertas disponibles para agregar</p>
                    </td>
                </tr>
            `);
        } else {
            ofertas.forEach(oferta => {
                tbody.append(`
                    <tr>
                        <td>
                            <input type="checkbox" class="form-check-input" value="${oferta.idOferta}">
                        </td>
                        <td>${oferta.idOferta}</td>
                        <td>${oferta.claveMateria}</td>
                        <td>${oferta.nombreMateria}</td>
                        <td>${oferta.nombreDocente}</td>
                        <td class="text-center">
                            <small>${oferta.horario || 'N/A'}</small>
                        </td>
                    </tr>
                `);
            });
        }

        $('#contadorOfertasDisponibles').text(ofertas.length);
        $('#selectAllDisponibles').prop('checked', false);
        actualizarEstadoBotones();
    }

    // Quitar ofertas seleccionadas
    function quitarOfertasSeleccionadas() {
        const ofertasSeleccionadas = [];
        $('#cuerpoOfertasAsignadas input[type="checkbox"]:checked').each(function () {
            ofertasSeleccionadas.push(parseInt($(this).val()));
        });

        if (ofertasSeleccionadas.length === 0) {
            mostrarMensaje('warning', 'Seleccione al menos una oferta para quitar');
            return;
        }

        // Mover ofertas de asignadas a disponibles
        const ofertasAMover = ofertasAsignadasActuales.filter(oferta =>
            ofertasSeleccionadas.includes(oferta.idOferta)
        );

        // Remover de asignadas
        ofertasAsignadasActuales = ofertasAsignadasActuales.filter(oferta =>
            !ofertasSeleccionadas.includes(oferta.idOferta)
        );

        // Agregar a disponibles
        ofertasDisponibles.push(...ofertasAMover);

        // Actualizar tablas
        mostrarOfertasAsignadas(ofertasAsignadasActuales);
        mostrarOfertasDisponibles(ofertasDisponibles);

        detectarCambios();
        mostrarMensaje('success', `${ofertasSeleccionadas.length} oferta(s) removida(s)`);
    }

    // Agregar ofertas seleccionadas
    function agregarOfertasSeleccionadas() {
        const ofertasSeleccionadas = [];
        $('#cuerpoOfertasDisponibles input[type="checkbox"]:checked').each(function () {
            ofertasSeleccionadas.push(parseInt($(this).val()));
        });

        if (ofertasSeleccionadas.length === 0) {
            mostrarMensaje('warning', 'Seleccione al menos una oferta para agregar');
            return;
        }

        // Mover ofertas de disponibles a asignadas
        const ofertasAMover = ofertasDisponibles.filter(oferta =>
            ofertasSeleccionadas.includes(oferta.idOferta)
        );

        // Remover de disponibles
        ofertasDisponibles = ofertasDisponibles.filter(oferta =>
            !ofertasSeleccionadas.includes(oferta.idOferta)
        );

        // Agregar a asignadas
        ofertasAsignadasActuales.push(...ofertasAMover);

        // Actualizar tablas
        mostrarOfertasAsignadas(ofertasAsignadasActuales);
        mostrarOfertasDisponibles(ofertasDisponibles);

        detectarCambios();
        mostrarMensaje('success', `${ofertasSeleccionadas.length} oferta(s) agregada(s)`);
    }

    // Detectar cambios en las ofertas
    function detectarCambios() {
        const ofertasOriginalesIds = ofertasAsignadasOriginales.map(o => o.idOferta).sort();
        const ofertasActualesIds = ofertasAsignadasActuales.map(o => o.idOferta).sort();

        cambiosDetectados = JSON.stringify(ofertasOriginalesIds) !== JSON.stringify(ofertasActualesIds);

        if (cambiosDetectados) {
            $('#alertaCambios').show();
            $('#btnGuardarModificacion').prop('disabled', false);
        } else {
            $('#alertaCambios').hide();
            $('#btnGuardarModificacion').prop('disabled', true);
        }
    }

    // Actualizar estado de botones
    function actualizarEstadoBotones() {
        const ofertasAsignadasSeleccionadas = $('#cuerpoOfertasAsignadas input[type="checkbox"]:checked').length;
        const ofertasDisponiblesSeleccionadas = $('#cuerpoOfertasDisponibles input[type="checkbox"]:checked').length;

        $('#btnQuitarOfertas').prop('disabled', ofertasAsignadasSeleccionadas === 0);
        $('#btnAgregarOfertas').prop('disabled', ofertasDisponiblesSeleccionadas === 0);
    }

    // Guardar modificaciones
    function guardarModificaciones() {
        if (!cambiosDetectados) {
            mostrarMensaje('info', 'No hay cambios para guardar');
            return;
        }

        if (confirm('¿Está seguro de que desea guardar las modificaciones al horario del alumno?')) {
            const datosGuardar = {
                noControl: alumnoActual.noControl,
                ofertasAsignadas: ofertasAsignadasActuales.map(o => o.idOferta)
            };

            mostrarDatosGuardados(`Horarios guardados correctamente.`,
                () => option("horario", ""));
        }
    }

    // Utilidades de UI
    function mostrarCargando(mostrar) {
        if (mostrar) {
            $('#btnBuscarAlumno').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Buscando...');
        } else {
            $('#btnBuscarAlumno').prop('disabled', false).html('<i class="fas fa-search"></i> Buscar');
        }
    }

    function mostrarError(elementId, mensaje) {
        $(`#${elementId}`).text(mensaje).show();
    }

    function limpiarErrores() {
        $('.error-message').hide();
    }

    function limpiarFormulario() {
        alumnoActual = null;
        ofertasAsignadasOriginales = [];
        ofertasAsignadasActuales = [];
        ofertasDisponibles = [];
        cambiosDetectados = false;

        $('#seccionAlumno').hide();
        $('#seccionOfertasAsignadas').hide();
        $('#seccionOfertasDisponibles').hide();
        $('#alertaCambios').hide();
        $('#btnGuardarModificacion').prop('disabled', true);
    }

    function mostrarMensaje(tipo, mensaje) {
        const iconos = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const colores = {
            success: 'alert-success',
            error: 'alert-danger',
            warning: 'alert-warning',
            info: 'alert-info'
        };

        const alertaHtml = `
            <div class="alert ${colores[tipo]} alert-dismissible fade show" role="alert">
                <i class="${iconos[tipo]} me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Remover alertas previas
        $('.alert:not(.alert-info)').remove(); // No remover la alerta del periodo

        // Agregar nueva alerta al inicio del card-body
        $('#frmHorarioIndividual .card-body').prepend(alertaHtml);

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            $('.alert:not(.alert-info)').fadeOut();
        }, 5000);
    }

    // Exponer funciones globales que necesitan ser accesibles desde horario.js
    window.HorarioIndividual = {
        inicializar: function () {
            inicializarEventos();
            cargarInformacionPeriodo();

            // Mostrar instrucciones iniciales
            setTimeout(() => {
                mostrarMensaje('info', `Modo de prueba activado. Use el número de control: <strong>${DATOS_PRUEBA.alumno.noControl}</strong> para probar la funcionalidad.`);
            }, 1000);
        }
    };

})();
