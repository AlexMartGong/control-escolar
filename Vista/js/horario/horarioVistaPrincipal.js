/**
 * Sistema de gestión de horarios por carrera con paginación
 * Autor: Sistema de Gestión Académica
 * Fecha: 2024
 */

// Evitar redeclaración de la clase si ya existe
if (typeof window.HorarioCarreraManager === 'undefined') {

    class HorarioCarreraManager {
        constructor() {
            this.tablasPorPagina = 2;
            this.paginaActual = 1;
            this.totalCarreras = 0;
            this.todasLasCarreras = [];
            this.instanceId = 'horario_' + Date.now();
            this.init();
        }

        init() {
            this.obtenerCarreras();
            this.mostrarPagina(1);
            this.inicializarDataTables();
        }

        obtenerCarreras() {
            const secciones = document.querySelectorAll('.carrera-section');
            this.todasLasCarreras = Array.from(secciones);
            this.totalCarreras = this.todasLasCarreras.length;
            this.actualizarPaginacion();
        }

        mostrarPagina(numeroPagina) {
            this.paginaActual = numeroPagina;

            this.todasLasCarreras.forEach(carrera => {
                carrera.style.display = 'none';
            });

            const inicio = (numeroPagina - 1) * this.tablasPorPagina;
            const fin = inicio + this.tablasPorPagina;

            const carrerasEnPagina = this.todasLasCarreras.slice(inicio, fin);
            carrerasEnPagina.forEach(carrera => {
                carrera.style.display = 'block';
            });

            this.actualizarEstadoPaginacion();

            setTimeout(() => {
                this.inicializarDataTablesVisibles();
            }, 100);
        }

        actualizarPaginacion() {
            const totalPaginas = Math.ceil(this.totalCarreras / this.tablasPorPagina);
            const paginationContainer = document.getElementById('paginationCarreras');

            if (!paginationContainer) return;

            // Limpiar contenido existente
            paginationContainer.innerHTML = '';

            if (totalPaginas <= 1) {
                return;
            }

            // Botón Anterior
            const prevLi = document.createElement('li');
            prevLi.className = `page-item ${this.paginaActual === 1 ? 'disabled' : ''}`;
            prevLi.innerHTML = `<a class="page-link" href="#" data-page="${this.paginaActual - 1}">Anterior</a>`;
            paginationContainer.appendChild(prevLi);

            // Botones de páginas
            for (let i = 1; i <= totalPaginas; i++) {
                const li = document.createElement('li');
                li.className = `page-item ${i === this.paginaActual ? 'active' : ''}`;
                li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
                paginationContainer.appendChild(li);
            }

            // Botón Siguiente
            const nextLi = document.createElement('li');
            nextLi.className = `page-item ${this.paginaActual === totalPaginas ? 'disabled' : ''}`;
            nextLi.innerHTML = `<a class="page-link" href="#" data-page="${this.paginaActual + 1}">Siguiente</a>`;
            paginationContainer.appendChild(nextLi);

            this.configurarEventosPaginacion();
        }

        configurarEventosPaginacion() {
            const paginationContainer = document.getElementById('paginationCarreras');
            if (!paginationContainer) return;

            // Remover event listeners anteriores si existen
            if (this.paginationHandler) {
                paginationContainer.removeEventListener('click', this.paginationHandler);
            }

            // Crear nuevo handler
            this.paginationHandler = (e) => {
                e.preventDefault();

                const link = e.target.closest('.page-link');
                if (!link) return;

                const pageItem = link.closest('.page-item');
                if (pageItem && pageItem.classList.contains('disabled')) return;

                const pagina = parseInt(link.dataset.page);
                if (pagina && !isNaN(pagina) && pagina !== this.paginaActual) {
                    this.mostrarPagina(pagina);
                }
            };

            // Agregar el nuevo event listener
            paginationContainer.addEventListener('click', this.paginationHandler);
        }

        actualizarEstadoPaginacion() {
            const totalPaginas = Math.ceil(this.totalCarreras / this.tablasPorPagina);
            const inicio = (this.paginaActual - 1) * this.tablasPorPagina + 1;
            const fin = Math.min(this.paginaActual * this.tablasPorPagina, this.totalCarreras);

            let estadoInfo = document.getElementById('estadoPaginacion');
            if (!estadoInfo) {
                estadoInfo = document.createElement('div');
                estadoInfo.id = 'estadoPaginacion';
                estadoInfo.className = 'text-center text-muted mb-3';

                const container = document.getElementById('tablasContainer');
                if (container && container.parentNode) {
                    container.parentNode.insertBefore(estadoInfo, container.nextSibling);
                }
            }

            if (this.totalCarreras > 0) {
                estadoInfo.innerHTML = `
                    <small>
                        Mostrando carreras ${inicio} a ${fin} de ${this.totalCarreras}
                        (Página ${this.paginaActual} de ${totalPaginas})
                    </small>
                `;
            } else {
                estadoInfo.innerHTML = '<small>No se encontraron carreras</small>';
            }

            this.actualizarBotonesPaginacion();
        }

        actualizarBotonesPaginacion() {
            const paginationContainer = document.getElementById('paginationCarreras');
            if (!paginationContainer) return;

            const totalPaginas = Math.ceil(this.totalCarreras / this.tablasPorPagina);
            const pageItems = paginationContainer.querySelectorAll('.page-item');

            pageItems.forEach(item => {
                const link = item.querySelector('.page-link');
                if (!link) return;

                const page = parseInt(link.dataset.page);

                // Actualizar estado activo
                if (!isNaN(page)) {
                    if (page === this.paginaActual) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                }

                // Actualizar estado deshabilitado para Anterior
                if (link.textContent === 'Anterior') {
                    if (this.paginaActual === 1) {
                        item.classList.add('disabled');
                    } else {
                        item.classList.remove('disabled');
                        link.dataset.page = this.paginaActual - 1;
                    }
                }

                // Actualizar estado deshabilitado para Siguiente
                if (link.textContent === 'Siguiente') {
                    if (this.paginaActual === totalPaginas) {
                        item.classList.add('disabled');
                    } else {
                        item.classList.remove('disabled');
                        link.dataset.page = this.paginaActual + 1;
                    }
                }
            });
        }

        inicializarDataTables() {
            const commonConfig = {
                responsive: true,
                pageLength: 10,
                order: [[0, "asc"]],
                pagingType: "simple_numbers",
                lengthMenu: [[5, 10, 25, -1], [5, 10, 25, "Todos"]],
                language: {
                    paginate: {
                        previous: "Anterior",
                        next: "Siguiente",
                    },
                    emptyTable: "No hay registros de horarios para mostrar",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "Mostrando 0 a 0 de 0 registros",
                    infoFiltered: "(filtrado de _MAX_ registros totales)",
                    search: "Buscar en esta carrera:",
                    lengthMenu: "Mostrar _MENU_ registros por página"
                },
                columnDefs: [
                    {searchable: true, targets: [0, 1, 2]},
                    {searchable: false, targets: [3]},
                    {orderable: false, targets: [3]}
                ],
                dom: 'frtip'
            };

            const tablas = document.querySelectorAll('.horario-table');
            tablas.forEach(tabla => {
                if ($.fn.DataTable.isDataTable(tabla)) {
                    $(tabla).DataTable().destroy();
                }
                $(tabla).DataTable(commonConfig);
            });
        }

        inicializarDataTablesVisibles() {
            const commonConfig = {
                responsive: true,
                pageLength: 10,
                order: [[0, "asc"]],
                pagingType: "simple_numbers",
                lengthMenu: [[5, 10, 25, -1], [5, 10, 25, "Todos"]],
                language: {
                    paginate: {
                        previous: "Anterior",
                        next: "Siguiente",
                    },
                    emptyTable: "No hay registros de horarios para mostrar",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "Mostrando 0 a 0 de 0 registros",
                    infoFiltered: "(filtrado de _MAX_ registros totales)",
                    search: "Buscar en esta carrera:",
                    lengthMenu: "Mostrar _MENU_ registros por página"
                },
                columnDefs: [
                    {searchable: true, targets: [0, 1, 2]},
                    {searchable: false, targets: [3]},
                    {orderable: false, targets: [3]}
                ],
                dom: 'frtip'
            };

            const tablasVisibles = document.querySelectorAll('.carrera-section[style*="block"] .horario-table');
            tablasVisibles.forEach(tabla => {
                if ($.fn.DataTable.isDataTable(tabla)) {
                    $(tabla).DataTable().destroy();
                }
                $(tabla).DataTable(commonConfig);
            });
        }

        // Método para limpiar la instancia
        destroy() {
            // Limpiar event listeners
            const paginationContainer = document.getElementById('paginationCarreras');
            if (paginationContainer && this.paginationHandler) {
                paginationContainer.removeEventListener('click', this.paginationHandler);
            }

            // Limpiar DataTables
            $('.horario-table').each(function () {
                if ($.fn.DataTable.isDataTable(this)) {
                    $(this).DataTable().destroy();
                }
            });
        }
    }

    // Exportar la clase al objeto window solo si no existe
    window.HorarioCarreraManager = HorarioCarreraManager;
}

// Funciones auxiliares globales - solo declarar si no existen
if (typeof window.loadFormHorario === 'undefined') {
    window.loadFormHorario = function (form, id) {
        console.log(`Cargando formulario: ${form} con ID: ${id}`);
        alert(`Funcionalidad de ${form} con ID: ${id} - Por implementar`);
    };
}

if (typeof window.eliminarHorario === 'undefined') {
    window.eliminarHorario = function (id) {
        const confirmacion = confirm(`¿Está seguro de eliminar el horario ${id}? Esta acción no se puede deshacer.`);
        if (confirmacion) {
            console.log(`Eliminando horario ${id}`);
            alert(`Horario ${id} eliminado exitosamente`);

            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    };
}

// Mantener la función anterior para compatibilidad si es necesaria
if (typeof window.changeStatusHorario === 'undefined') {
    window.changeStatusHorario = function (id, nuevoEstado, estadoActual) {
        if (nuevoEstado === estadoActual) {
            alert('El horario ya tiene ese estado');
            return;
        }

        const confirmacion = confirm(`¿Está seguro de cambiar el estado del horario ${id} a "${nuevoEstado}"?`);
        if (confirmacion) {
            console.log(`Cambiando estado del horario ${id} de "${estadoActual}" a "${nuevoEstado}"`);
            alert(`Estado del horario ${id} cambiado a: ${nuevoEstado}`);

            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    };
}

// Función de inicialización que maneja múltiples ejecuciones
function initHorarioCarreraManager() {
    // Destruir instancia anterior si existe
    if (window.horarioManagerInstance) {
        try {
            // Llamar al método destroy si existe
            if (window.horarioManagerInstance.destroy) {
                window.horarioManagerInstance.destroy();
            }
        } catch (e) {
            console.warn('Error limpiando instancia anterior:', e);
        }
    }

    // Verificar que los elementos necesarios estén disponibles
    if (document.getElementById('frmArea') && document.querySelectorAll('.carrera-section').length > 0) {
        // Crear nueva instancia
        window.horarioManagerInstance = new window.HorarioCarreraManager();
    }
}

// Inicializar cuando el DOM esté listo o cuando se cargue dinámicamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
            initHorarioCarreraManager();
        } else {
            setTimeout(() => {
                if (typeof $ !== 'undefined' && $.fn.DataTable) {
                    initHorarioCarreraManager();
                } else {
                    console.error('jQuery o DataTables no están disponibles');
                }
            }, 500);
        }
    });
} else {
    // Si el DOM ya está cargado (contenido dinámico)
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        setTimeout(() => {
            initHorarioCarreraManager();
        }, 100);
    } else {
        setTimeout(() => {
            if (typeof $ !== 'undefined' && $.fn.DataTable) {
                initHorarioCarreraManager();
            } else {
                console.error('jQuery o DataTables no están disponibles');
            }
        }, 500);
    }
}