import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarBarraAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(resultado => {
                    if (resultado.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarBarraAvance();
                    }
                });
        }
        if (e.target.classList.contains('fa-trash')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            Swal.fire({
                title: ' ¿ Estás seguro ? ',
                text: 'No será posible revertir esto',
                type: 'warning',
                showCancelButton: true,
                confirmButton: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: ' ¡Si, eliminalo!',
                cancelButtonText: 'No, Cancelar'
            }).then(result => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, {
                            params: {
                                idTarea
                            }
                        })
                        .then(respuesta => {
                            Swal.fire(
                                    'Tarea Eliminado!',
                                    respuesta.data,
                                    'success'
                                )
                                .then(result => {
                                    if (result.value) {
                                        const tareaHtml = icono.parentElement.parentElement;
                                        tareaHtml.parentElement.removeChild(tareaHtml);
                                        actualizarBarraAvance();
                                    }
                                });
                        })
                        .catch(() => {
                            Swal.fire({
                                    type: 'error',
                                    title: 'Hubo un error',
                                    text: 'No se pudo eliminar el proyecto'
                                })
                                .then(() => {
                                    window.location.href = '/';
                                });
                        });
                }
            })
        }
    });
}