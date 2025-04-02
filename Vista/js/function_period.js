function loadFormPeriodo(id) {
    let container = $('#frmArea');
    let url = id === "none" ? "period/frmPeriod.php" : (id === "mod" ? "period/modPeriodo.php?id="  : "");

    if (!url) return;

    container.fadeOut(300, function () {
        clearArea('frmArea'); // Limpia el área antes de cargar contenido

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.text())
        .then(responseText => {
            try {
                container.html(responseText).hide().fadeIn(500).css("transform", "translateY(-10px)").animate({
                    opacity: 1,
                    transform: "translateY(0px)"
                }, 300, function () {
                    // **Inicializar datepickers después de la animación**
                    $('.datepicker').datepicker({
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        language: 'es'
                    });

                    // **Llamada al método para calcular el periodo**
                    obtenerPeriodo();
                });

            } catch (error) {
                mostrarErrorCaptura('Error al cargar el formulario: ' + error);
            }
        })
        .catch(error => {
            mostrarErrorCaptura('Error de conexión: ' + error);
        });
    });
}


/**
 * Función para cambiar el estado de un período con confirmación
 * @param {string} id - ID del período a modificar
 * @param {string} status - Nuevo estado seleccionado
 * @param {string} currentStatus - Estado actual del período
 */
function changeStatus(pid, pestado, currentStatus) {
    // Si no hay un estado seleccionado (opción por defecto), no hacer nada
    if (!pestado || pestado === "Cambiar estado") {
        return;
    }

    // Verificar si el estado actual es Cancelado o Cerrado
    if (currentStatus === "Cancelado" || currentStatus === "Cerrado") {
        // Mostrar mensaje de error
        mostrarErrorCaptura(`No se puede cambiar el estado del período ${pid} porque su estado actual es "${currentStatus}".`);

        // Resetear el select
        const selectElement = document.querySelector(`select[onchange="changeStatus('${pid}', this.value, '${currentStatus}')"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
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
                    <p class="text-center">¿Está seguro de cambiar el estado del período <strong>${pid}</strong> a <strong>${pestado}</strong>?</p>
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
    let modalAnterior = document.getElementById('confirmStatusModal');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar el modal al documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar el modal
    let modalElement = document.getElementById('confirmStatusModal');
    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Configurar acción para el botón cancelar
    document.getElementById('btnCancelar').addEventListener('click', function () {
        // Resetear el select al cancelar
        const selectElement = document.querySelector(`select[onchange="changeStatus('${pid}', this.value, '${currentStatus}')"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
    });

    // También resetear al cerrar el modal con la X o haciendo clic fuera
    modalElement.addEventListener('hidden.bs.modal', function () {
        const selectElement = document.querySelector(`select[onchange="changeStatus('${pid}', this.value, '${currentStatus}')"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0;
        }
        modalElement.remove();
    });

    // Configurar acción para el botón confirmar
    document.getElementById('btnConfirmar').addEventListener('click', function () {
        // Cerrar el modal
        modal.hide();

        // Preparar datos para enviar
        let data = {
            pid: pid,
            pestado: pestado
        };

        // Convertir a JSON
        let json = JSON.stringify(data);

        console.log(`Cambiando estado de período ${pid} a ${pestado}`);

        let url = '../../Controlador/Intermediarios/Periodo/CambiarEstado.php';

        // Enviar datos por json al script CambiarEsatdo.php
        $.post(url, json, function (responseText, status) {
            console.log("Respuesta recibida:");
            console.log("Estado de la petición:", status);
            console.log("Texto de respuesta:", responseText);

            try {
                // Verificar si la respuesta es JSON válido
                let respuesta = JSON.parse(responseText.trim()); // Trim para eliminar cualquier espacio extra
                console.log("Respuesta parseada:", respuesta);

                if (respuesta.estado === 'OK') {
                    mostrarDatosGuardados(`El estado del período ${pid} ha sido cambiado a "${pestado}" correctamente.`, function () {
                        // Recargar la tabla de periodos después de la actualización exitosa
                        option('period', '');
                    });
                } else {
                    mostrarErrorCaptura(`Error: ${respuesta.mensaje || "No se pudo cambiar el estado."}`);
                }
            } catch (error) {
                // Mostrar el error y el contenido de la respuesta para depuración
                console.error("Error al parsear JSON:", error);
                console.error("Respuesta problemática:", responseText);
                mostrarErrorCaptura("Error al Cambiar Estado. Por favor, inténtalo de nuevo más tarde. " + error.message);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            mostrarErrorCaptura("Hubo un error de conexión. Asegúrate de estar conectado a Internet e intenta nuevamente. " + textStatus + " - " + errorThrown);
        });

    });
}

