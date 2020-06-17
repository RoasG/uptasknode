import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;

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
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    .then(respuesta => {
                        console.log(respuesta);
                        Swal.fire(
                                'Proyecto Eliminado!',
                                respuesta.data,
                                'success'
                            )
                            .then(result => {
                                if (result.value) {
                                    setTimeout(() => {
                                        window.location.href = '/';
                                    }, 500);
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
    });
}