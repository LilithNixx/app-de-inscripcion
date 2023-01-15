const formulario = document.getElementById("formulario");
const cardsEstudiantes = document.getElementById("cardsEstudiantes");
const cardsProfesores = document.getElementById("cardsProfesores");
const templateEstudiante = document.getElementById("templateEstudiante").content;
const templateProfesor = document.getElementById("templateProfesor").content;
const alert = document.querySelector(".alert");


const estudiantes = []; //array de estudiantes
const profesores = [];  //array de profesores


document.addEventListener('click', e => {
    
    //Para cambiar la nota con los botones:
    if(e.target.dataset.uid){
        if(e.target.matches(".btn-Aprobar")){
            estudiantes.map(item => {
                if(item.uid === e.target.dataset.uid){
                    item.setEstado = true;
                }
                
                return item
            });
        }
        if(e.target.matches(".btn-Reprobar")){
            estudiantes.map(item => {
                if(item.uid === e.target.dataset.uid){
                    item.setEstado = false;
                }

                return item
            });
        }
        Persona.pintarPersonaUI(estudiantes, "Estudiante");
    }
});

//CLASES

class Persona {
    constructor(nombre, edad){
        this.nombre = nombre;
        this.edad = edad;
        this.uid = `${Date.now()}`; //las comillas invertidas convierten a string
    }

    static pintarPersonaUI (personas, tipo){
        if(tipo === "Estudiante"){

            cardsEstudiantes.textContent= "";

            const fragment = document.createDocumentFragment();

            personas.forEach((item) => {
                fragment.appendChild(item.agregarNuevoEstudiante());
            });

            cardsEstudiantes.appendChild(fragment);

        }

        if (tipo === "Profesor"){

            cardsProfesores.textContent = "";

            const fragment = document.createDocumentFragment();

            personas.forEach((item) => {
                fragment.appendChild(item.agregarNuevoProfesor());
            });

            cardsProfesores.appendChild(fragment);
        }
    }
}

class Estudiante extends Persona {
    //Propiedades privadas:
    #estado = false; //para cambiar los botones de aprobado y reprobado
    #estudiante = "Estudiante";
    
    set setEstado (estado){
        this.#estado = estado;
    }
    
    get getEstudiante () {
        return this.#estudiante
    }
    
    agregarNuevoEstudiante(){
        
        const clone = templateEstudiante.cloneNode(true);
       
        clone.querySelector(".student-name").textContent = this.nombre;
        clone.querySelector("h6").textContent = this.getEstudiante;
        clone.querySelector(".age").textContent = this.edad;

        if (this.#estado){
            //className  obtiene y establece el valor del atributo class del elemento especificado
            clone.querySelector(".student-mark").className = " student-mark btn-Aprobar";
           
            //bloquear o desbloquear los botones:
            clone.querySelector(".btn-Aprobar").disabled = true; //disabled sirve para desactivar el botón
            clone.querySelector(".btn-Reprobar").disabled = false; //cuando activamos un botón desactivamos otro
        }else {
            clone.querySelector(".student-mark").className = "student-mark btn-Reprobar";
            
            clone.querySelector(".btn-Reprobar").disabled = true;
            clone.querySelector(".btn-Aprobar").disabled = false;
        }

        //cambiar el texto de .student-mark dependiendo del estado
        clone.querySelector(".student-mark").textContent = this.#estado ? "Aprobado" : "Reprobado";
        
        //siempre que encuentro data-algo en html es xq se está manipulando con js
        clone.querySelector(".btn-Aprobar").dataset.uid = this.uid;
        clone.querySelector(".btn-Reprobar").dataset.uid = this.uid;
        
        return clone

    }
}

class Profesor extends Persona {
    #profesor = "Profesor";

    agregarNuevoProfesor (){
        const clone = templateProfesor.cloneNode(true);
        clone.querySelector("h5").textContent = this.nombre;
        clone.querySelector("h6").textContent = this.#profesor;
        clone.querySelector(".profAge").textContent = this.edad;
        
        return clone
    }
}

//Escondemos la alerta
alert.style.visibility = 'hidden';

//capturar el formulario
formulario.addEventListener('submit', e =>{
    //Cancela el evento si este es cancelable, sin detener el resto del funcionamiento del evento
    e.preventDefault();
    
    alert.style.visibility = 'hidden';

    const datos = new FormData(formulario);
    //console.log(...datos.values());
    //creamos 3 constantes para guardar la informacion de cada estudiante/profesor
    const [nombre, edad, opcion] = [...datos.values()];
   
    //validación para que el usuario no agregue espacios en blanco
    //trim() completa espacios en blanco en una cadena de texto
    if(!nombre.trim()){
        alert.style.visibility = 'visible';
        return;
    } 

    //Estudiante es el value que le dimos al option en HTML
    if(opcion === "Estudiante"){
       //crear una instancia de estudiante
        const estudiante = new Estudiante(nombre, edad);
        estudiantes.push(estudiante); //agrego las instancias de estudiante
        
        Persona.pintarPersonaUI(estudiantes, opcion);
    }
    if(opcion === "Profesor"){
        
        const profesor = new Profesor(nombre, edad);
        profesores.push(profesor);

        Persona.pintarPersonaUI(profesores, opcion);
    }

});