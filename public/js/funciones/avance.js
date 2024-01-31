import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    // seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');  // nos aseguramos que solo los li sean seleccionados
    if(tareas.length) {
    //seleccionar las tareas completadas
        const tareascompletas = document.querySelectorAll('i.completo')
    // calcular el avance , obtener el porcentaje con reglas de 3 simples
        const avance = Math.round(tareascompletas.length / tareas.length  * 100);
    // mostrar el avance
    const porcentaje = document.querySelector('#porcentaje')
    porcentaje.style.width = avance+'%';

    if(avance === 100) {
        Swal.fire({ 
            title: "Completaste el Proyecto",
            text: "Felicidades, terminastes tus tareas", //a obtiene la respuesto del send del status 200
            icon: "success"
        });
    }

    }
}