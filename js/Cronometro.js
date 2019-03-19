//inicializo las variables a 0;
var hr = checkTime(0);
var min = checkTime(0);
var sec = checkTime(0);

var crono;
//variable para saber si ya se ha inicializado.
var ini = false;

function reset(){
    //igualo las variables otra vez a 0
    hr = checkTime(0);
    min = checkTime(0);
    sec = checkTime(0);
    //Lo paso al html
    document.getElementById("cronometro").innerHTML = hr + ":" + min + ":" + sec;
    //Y lo modifico también en los localStorage
    setHours(hr);
    setMinutes(min);
    setSeconds(sec);
}

function iniciar(){
    //Si no está inicializada entra y ya pongo la variable a true
    if(!ini){
        ini = true;
        //Cada segundo pasa al update
        crono = setInterval(update,1000);
        //Como está iniciado bloqueo el botón "iniciar".
        document.getElementById("iniciar").disabled = true;
        //Como está iniciado desbloqueo el botón "parar".
        document.getElementById("parar").disabled = false;
        //Y le digo que el estado es corriendo
        setState("running");
    }  
}

function parar(){
    //El clearInterval para el tiempo. (jajaja ojalá xD)
    clearInterval(crono);
    //Lo pongo en falso porque ahora está parado
    ini = false;
    //Lo contrario a antes, ahora está parado y quiero que le pueda dar a iniciar, pero no volver a dar a parar.
    document.getElementById("iniciar").disabled = false;
    document.getElementById("parar").disabled = true;
    setState("stopped");
}

function update(){
    //cada vez que entra suma un segundo
    sec++;
    //Miro a ver si es menor que 10
    sec = checkTime(sec);
    //Lo modifico en almacen
    setSeconds(sec);
    //cada 60 secs es un min y lo miro en la variable
    if(sec >=60){
        //sumo un min
        min++;
        min = checkTime(min);
        sec = checkTime(0);
        //actulizo en el almacen
        setMinutes(min);
    }
    //Lo mismo pero ahora con minutos y horas
    if(min >= 60){
        hr++;
        hr = checkTime(hr);
        min = checkTime(0);
        setHours(hr);
    }
    //actulizo en el html
    document.getElementById("cronometro").innerHTML = hr + ":" + min + ":" + sec;
}
//Para que los números menores de 10 se puedan ver como 01 y no 1
//Me explico? en dos dígitos xD
function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; 
    return i;
}
//Estos son los metodos que necesito para ir modificando en los localStorage
function setState(estado){
    localStorage.setItem("estado",estado);
}

function setSeconds(sec){
    localStorage.setItem("segundos",sec);
}

function setMinutes(min){
    localStorage.setItem("minutos",min);
}

function setHours(hs){
    localStorage.setItem("horas",hs);
}

window.onload = function(){
    var estado = localStorage.getItem("estado");
     sec = localStorage.getItem("segundos") != null ? localStorage.getItem("segundos") : checkTime(0);
     min = localStorage.getItem("minutos") != null ? localStorage.getItem("minutos") : checkTime(0);
     hr = localStorage.getItem("horas") != null ? localStorage.getItem("horas") : checkTime(0);

    document.getElementById("cronometro").innerHTML = hr + ":" + min + ":" + sec;
    console.log(estado);
    if(estado == "running"){
        iniciar();
    }
    iniciar();
}