import Swal from 'sweetalert2';

export const actualizarBarraAvance = () => {
    const tareas = document.querySelectorAll('li.tarea').length;
    const tareasSelec = document.querySelectorAll('i.completo').length;
    if (tareas > 0) {
        const avance = Math.round((tareasSelec / tareas) * 100);
        const barra = document.querySelector('#porcentaje');
        barra.style.width = avance + '%';

        if (avance === 100) {
            Swal.fire(
                'Completaste las tareas!',
                'Felicidades, has terminado todo!!',
                'success'
            )
        }
    }
}