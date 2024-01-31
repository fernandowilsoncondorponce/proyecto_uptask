import Swal from 'sweetalert2';
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')

if (btnEliminar) { //si existe este elemento
    btnEliminar.addEventListener('click' , e => {
        // lee el data-proyecto-url de el boton eliminar en tareas
        const urlProyecto = e.target.dataset.proyectoUrl;
        // console.log(urlProyecto)

        

        Swal.fire({
                title: "Deseas borrar este proyecto?",
                text: "Un proyecto eliminado no se puede recuperar",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Borrar",
                // se agrego este texto para cancelar
                cancelButtonText : 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // enviar peticion a axios : es una forma de hacer request con fech para ser get,delet , put , post 
                    const url = `${location.origin}/proyectos/${urlProyecto}` // nos ayudara para hacer el put
                    
                    axios.delete(url, {params:{urlProyecto}})
                        .then(function(respuesta){
                            console.log(respuesta) 
                            // movimos este codigo aqui  para que sea parte de la respuesta
                            // return;
                                Swal.fire({ 
                                    title: "Proyecto Eliminado",
                                    text: respuesta.data, //a obtiene la respuesto del send del status 200
                                    icon: "success"
                                });

                                // Redireccionar al inicio
                                setTimeout(() => {
                                    window.location.href = '/'
                                }, 3000);
                        })
                        .catch(() => {
                            Swal.fire({
                                type: 'error',
                                title: 'Hubo un error', 
                                text : 'No se pudo eliminar el Proyecto'
                            })
                        })
                    }
            });
    })
}


export default btnEliminar