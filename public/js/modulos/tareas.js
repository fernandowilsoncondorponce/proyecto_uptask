import axios from "axios";
import Swal from 'sweetalert2'
import {actualizarAvance} from '../funciones/avance'

const tareas = document.querySelector('.listado-pendientes')

if(tareas) {
    tareas.addEventListener('click', e => {  // al dar click a tarea y a sus hijos se ejecuta
        // console.log(e.target.classList) //obtiene la info de la etiqueta presionada en este caso necesitamos los iconos 
        if(e.target.classList.contains('fa-check-circle')){ //ver si existe
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea; // TODO lo que haremos sera tener el id de la tarea
            
            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}` //crea una url con el id al final

            axios.patch(url, {idTarea}) // en este caso solo queremos cambiar el id de la tarea
                .then(function(respuesta){
                    console.log(respuesta) //obtendremos el send de tareasController
                    if(respuesta.status === 200){ //usamos el status que nos envia el tareasConstroller
                    
                        console.log(icono.classList.toggle('completo')) //aqui lo que hara es que si esta se lo "quita" y si no esta se lo "pone"  porque el clasList es un array  
                        // TODO cuando se agrega tarea actualizamos el avance
                        actualizarAvance();
                    }
                })
        } 
        if(e.target.classList.contains('fa-trash')){
            // console.log(e.target);
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;

            // console.log(tareaHTML)
            // console.log(idTarea)

            Swal.fire({
                title: "Deseas borrar esta Tarea?",
                text: "Una tarea eliminada no se puede recuperar",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Borrar",
                // se agrego este texto para cancelar
                cancelButtonText : 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // enviar el delete por medio axios , delete es el unico que requiere params
                    const url = `${location.origin}/tareas/${idTarea}` 

                    axios.delete(url, {params : {idTarea}})
                        .then(function(respuesta){
                            console.log(respuesta)

                            if(respuesta.status === 200){
                                //Eliminar el Nodo , es lo que elimina del dom sin necesidad de recargar
                                tareaHTML.parentElement.removeChild(tareaHTML)

                                // opcional una alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )
                                // TODO cuando se elimina la tarea podremos actualizar el avance
                                actualizarAvance();
                            }
                        })
                        
                }
            })
        }



    });
}
export default tareas