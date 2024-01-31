// el watch de webpack del bumble cada ves que exista un cambio se recargara otra ves el bumble
// por el bumble se puede usar import
import proyectos from './modulos/proyectos' //puedes agregar mas archivos
import tareas from './modulos/tareas'
import {actualizarAvance} from './funciones/avance'

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})