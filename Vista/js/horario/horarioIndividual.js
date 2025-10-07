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
        const spanPeriodo = $('#periodoInfo');

        fetch('../../Controlador/Intermediarios/Periodo/ObtenerPeriodoValido.php')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.datos) && data.datos.length > 0) {
                    const periodo = data.datos[0];
                    const texto = `${periodo.periodo} (Estado: ${periodo.estado}, Ajustes hasta: ${periodo.fecha_de_termino_ajustes})`;
                    spanPeriodo.text(texto);
                } else {
                    spanPeriodo.text('No hay periodo activo disponible.');
                }
            })
            .catch(error => {
                console.error('Error cargando el periodo activo:', error);
                spanPeriodo.text('Error al cargar la información del periodo.');
            });
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

        $.ajax({
            url: '../../Controlador/Intermediarios/Alumno/ModificarAlumno.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ Buscar: true, id: noControl }),
            dataType: 'json',
            success: function (respuesta) {
                mostrarCargando(false);

                if (respuesta.estado === 'OK') {
                    // Tomamos directamente los datos reales del alumno
                    alumnoActual = respuesta.datos;

                    mostrarInformacionAlumno(alumnoActual);
                    mostrarMensaje('success', 'Alumno encontrado correctamente');

                    cargarOfertasAsignadas();
                    cargarOfertasDisponibles();
                } else {
                    mostrarError('errorNoControl', respuesta.mensaje || 'Alumno no encontrado');
                    limpiarFormulario();
                }
            },
            error: function (xhr, status, error) {
                mostrarCargando(false);
                mostrarError('errorNoControl', 'Ocurrió un error al consultar el alumno. Intente más tarde.');
                console.error('Error AJAX:', status, error);
            }
        });
    }

    // Mostrar información del alumno
    function mostrarInformacionAlumno(alumno) {
        $('#alumnoNoControl').text(alumno.numero_de_control);
        $('#alumnoNombre').text(alumno.nombre_de_alumno);
        $('#alumnoSemestre').text(`${alumno.semestre}°`);
        $('#alumnoGrupo').text(alumno.grupo);
        $('#alumnoCarrera').text(alumno.nombre_de_carrera);
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

    // Cargar ofertas asignadas del alumno
    function cargarOfertasAsignadas() {
        const datosEnvio = {
            noControl: alumnoActual.numero_de_control,
            claveCarrera: alumnoActual.clave_de_carrera,
            semestre: alumnoActual.semestre,
            grupo: alumnoActual.grupo,
            turno: alumnoActual.turno
        };

        $.ajax({
            url: '../../Controlador/Intermediarios/Oferta/BuscarOfertasByCarreraSemestreGrupoTurnoNoControl.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datosEnvio),
            dataType: 'json',
            success: function (respuesta) {
                console.log("Respuesta del servidor Ofertas Asignadas:", respuesta);

                if (respuesta.estado === 'OK' && Array.isArray(respuesta.datos)) {
                    ofertasAsignadasActuales = [...respuesta.datos];
                    mostrarOfertasAsignadasIndiv(respuesta.datos);
                    $('#seccionOfertasAsignadas').show();
                } else {
                    $('#seccionOfertasAsignadas').text('No se pudieron cargar las ofertas asignadas. Intente nuevamente más tarde.');
                }
            },

            error: function (xhr, status, error) {
                console.error("Error AJAX:", status, error);
                $('#seccionOfertasAsignadas').text('Error al cargar las ofertas asignadas.');
            }
        });
    }

    // Cargar ofertas disponibles para el alumno
    function cargarOfertasDisponibles() {
        const datosEnvio = {
            noControl: alumnoActual.numero_de_control
        };

        $.ajax({
            url: '../../Controlador/Intermediarios/Oferta/BuscarOfertasDisponiblesByNoControl.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datosEnvio),
            dataType: 'json',
            success: function (respuesta) {
                console.log("Respuesta del servidor Ofertas Disponibles:", respuesta);

                if (respuesta.estado === 'OK' && Array.isArray(respuesta.datos)) {
                    ofertasDisponibles = [...respuesta.datos];
                    mostrarOfertasDisponibles(respuesta.datos);
                    $('#seccionOfertasDisponibles').show();
                } else {
                    $('#seccionOfertasDisponibles').text('No se pudieron cargar las ofertas disponibles. Intente nuevamente más tarde.');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error AJAX al cargar ofertas disponibles:", status, error);
                $('#seccionOfertasDisponibles').text('Error al cargar las ofertas disponibles.');
            }
        });
    }

    // Mostrar ofertas asignadas en tabla
    function mostrarOfertasAsignadasIndiv(ofertas) {
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
                            <input type="checkbox" class="form-check-input" value="${oferta.clave_de_oferta}">
                        </td>
                        <td>${oferta.clave_de_oferta}</td>
                        <td>${oferta.clave_de_materia}</td>
                        <td>${oferta.nombre_de_materia}</td>
                        <td>${oferta.semestre}</td>
                        <td>${oferta.grupo}</td>
                        <td>${oferta.turno}</td>
                        <td>${oferta.docente}</td>
                        <td>${oferta.nombre_de_carrera}</td>
                        <td>${oferta.periodo}</td>
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
                            <input type="checkbox" class="form-check-input" value="${oferta.clave_de_oferta}">
                        </td>
                        <td>${oferta.clave_de_oferta}</td>
                        <td>${oferta.clave_de_materia}</td>
                        <td>${oferta.nombre_de_materia}</td>
                        <td>${oferta.semestre}</td>
                        <td>${oferta.grupo}</td>
                        <td>${oferta.turno}</td>
                        <td>${oferta.docente}</td>
                        <td>${oferta.nombre_de_carrera}</td>
                        <td>${oferta.periodo}</td>
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
            ofertasSeleccionadas.includes(oferta.clave_de_oferta)
        );

        // Remover de asignadas
        ofertasAsignadasActuales = ofertasAsignadasActuales.filter(oferta =>
            !ofertasSeleccionadas.includes(oferta.clave_de_oferta)
        );

        // Agregar a disponibles
        ofertasDisponibles.push(...ofertasAMover);

        // Actualizar tablas
        mostrarOfertasAsignadasIndiv(ofertasAsignadasActuales);
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
            ofertasSeleccionadas.includes(oferta.clave_de_oferta)
        );

        // Remover de disponibles
        ofertasDisponibles = ofertasDisponibles.filter(oferta =>
            !ofertasSeleccionadas.includes(oferta.clave_de_oferta)
        );

        // Agregar a asignadas
        ofertasAsignadasActuales.push(...ofertasAMover);

        // Actualizar tablas
        mostrarOfertasAsignadasIndiv(ofertasAsignadasActuales);
        mostrarOfertasDisponibles(ofertasDisponibles);

        detectarCambios();
        mostrarMensaje('success', `${ofertasSeleccionadas.length} oferta(s) agregada(s)`);
    }

    // Detectar cambios en las ofertas
    function detectarCambios() {
        const ofertasOriginalesIds = ofertasAsignadasOriginales.map(o => o.clave_de_oferta).sort();
        const ofertasActualesIds = ofertasAsignadasActuales.map(o => o.clave_de_oferta).sort();

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

    /**
     * Envía al servidor los datos de los horarios de un alumno.
     * 
     * Flujo del método:
     *  1. Verifica si hay cambios detectados; si no, muestra mensaje y detiene la función.
     *  2. Extrae las claves de oferta de los horarios asignados actualmente.
     *  3. Arma el objeto de datos a enviar al intermediario en formato JSON.
     *  4. Realiza una llamada AJAX al intermediario para hacer la modificacion individual.
     *  5. Muestra mensajes al usuario según la respuesta del servidor.
    */
    function guardarModificaciones() {
        // Verificar si existen cambios para guardar
        if (!cambiosDetectados) {
            mostrarMensaje('info', 'No hay cambios para guardar');
            return;
        }

        // Extraer solo las claves de oferta del arreglo final
        const ofertasFinales = ofertasAsignadasActuales.map(oferta => oferta.clave_de_oferta);

        // Preparar el objeto de datos a enviar al intermediario
        const datos = {
            pnoControl: alumnoActual.numero_de_control,
            psemestre: alumnoActual.semestre,
            ofertas: ofertasFinales
        };

        console.log("Datos enviados al servidor:", datos);

        // URL del intermediario que manejará la modificación de horarios
        const url = "../../Controlador/Intermediarios/Horario/ModificarHorarioIndividual.php";

        // Llamada AJAX para enviar los datos y recibir respuesta del servidor
        $.ajax({
            url: url,
            method: "POST",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log("Respuesta cruda:", response);

                // Evaluar la respuesta del servidor
                if (response.estado === "OK") {
                    // Mostrar mensaje de éxito al usuario
                    mostrarDatosGuardados(
                        "El horario se modificó de manera individual correctamente.",
                        function () {
                            option("horario", "");
                        }
                    );
                } else {
                    
                    mostrarErrorCaptura("Ocurrió un problema al realizar la modificación individual. Por favor, inténtelo nuevamente más tarde.");
                }
            },
            error: function (xhr, status, error) {
                // Mostrar errores en consola y mensaje al usuario en caso de fallo de conexión
                console.error("Error AJAX al guardar horario:", xhr.responseText);
                console.error("Respuesta recibida pero con error:", xhr.responseText);
                mostrarMensaje('error', 'No se pudo conectar con el servidor. Inténtelo más tarde.');
            }
        });
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
        }
    };

})();
