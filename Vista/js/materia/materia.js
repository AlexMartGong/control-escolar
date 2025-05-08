function changeStatusMateria(id, status, currentStatus) {
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
                    <p class="text-center">¿Está seguro de cambiar el estado de la materia <strong>${id}</strong> a <strong>${status}</strong>?</p>
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
            `select[onchange="changeStatusCarrera('${id}', this.value, '${currentStatus}')"]`
        );
        if (selectElement) {
            selectElement.value = currentStatus;
        }
    });

    // También resetear al cerrar el modal con la X o haciendo clic fuera
    modalElement.addEventListener("hidden.bs.modal", function () {
        const selectElement = document.querySelector(
            `select[onchange="changeStatusCarrera('${id}', this.value, '${currentStatus}')"]`
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

            console.log(
                `Cambiando estado de carrera ${id} a ${status}`
            );

            // Realizar petición AJAX para cambiar el estado
            $.ajax({
                url: "../../Controlador/Intermediarios/Carrera/CambiarEstadoMateria.php",
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
                                `El estado de la carrera ${id} ha sido cambiado a "${
                                    status === "1" ? "Activo" : "Inactivo"
                                }" correctamente.`,
                                function () {
                                    option("carrera", "");
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
                }
                ,
                error: function (xhr, status, error) {
                    mostrarErrorCaptura(
                        `Error al cambiar el estado: ${status} - ${error}`
                    );
                },
            });
        });
}
