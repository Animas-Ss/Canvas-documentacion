console.log("conectado");

//guardo el lienzo
const canvas = document.getElementById('canvas1');
//tomo el lienzo y le doy todas las propiedades de contexto
const ctx = canvas.getContext('2d');
//console.log(ctx);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//matriz para guardar la generacion de las aprticulas de diferente tamaño y posicion
const particulasArray = [];

// declaramos una variable que nos va a ayudar para los colores de lo que pintemos
let hue = 0;//inicializamos en 0

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//declaro un objeto para declarar dos propiedades para asignarles las coordenadas de click 
const mouse = {
    x: null,
    y: null,
}

//function para asignar valores a mi objeto tanto eje x y eje y
canvas.addEventListener('click', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //llamo la funcion de mi dibujo y le paso de parametros la posicion
    //drawCircle();

    //crear de a grupos usamos con un for
    for(let i = 0; i < 5; i++){
        //para crear las aprticuas pero con el evento click
        particulasArray.push(new Particle());
    }
})

//fuction pero esta vez con evento move
canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    //llamamos la funcion que define nuestro elemento y le apsamos al posicion 
    //drawCircle()
        //crear de a grupos usamos con un for
        for(let i = 0; i < 5; i++){
            //para crear las aprticuas pero con el evento click
            particulasArray.push(new Particle());
        }
});


//funcion para poder empezar a enlazar eventos con mi dibujo
//function drawCircle() {
    //relleno color
    //ctx.fillStyle = 'blue';
    //borde
    //ctx.strokeStyle = 'red';
    //grosor de la linea de borde
    //ctx.lineWidth = 5;
    //ctx.beginPath();
    //posicion y forma
    //ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
    //activo la funcion stroke
    //ctx.stroke();
    //activo la funcion o metodo fill
    //ctx.fill();
    //console.log(ctx)
//};

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        //this.x = Math.random() * canvas.width;//posiciones aliatorias pero respecto al tamaño del lienzo
        //this.y = Math.random() * canvas.height;
        //tamaño aliatorio , segun por lo que lo multiplique agrando o reduzco su tamaño
        this.size = Math.random() * 15 + 1;
        //velocidad en el eje x aleatoria
        this.speedX = Math.random() * 3 - 1.5;
        //velocidad en el eje y aleatoria
        this.speedY = Math.random() * 3 - 1.5;
        //generar un color aleatorio 
        this.color =  'hsl(' + hue + ', 100%, 50%)'
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // parametros de arc(ejex, ejey, tamaño,)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

}

//llenamos el array o matriz que creamos con 100 particulas de diferente tamaño y velicidad tambien posicion
//function init(){
    //cargamos nuestra matris con cada particula creada de forma aliatoria
    //for(let i = 0; i< 100; i++){
    //    particulasArray.push(new Particle());
   // }
//}

//init();


// funcion para actualizar los elementos creados en este caso particulas pasandoles sus metodos
function handleParticles(){
    //recorro las aprticulas creadas y actualizo su estado de posicion y velocidad 100 veces
    for(let i = 0; i < particulasArray.length; i++){
        particulasArray[i].update();
        particulasArray[i].draw();
        //creamos un recorido adicional para poder crear una distancia entre particulas
        //las cuales vamos a marcar con una linea que funcionaria como hipotenisa 
        for(let j = i; j < particulasArray.length; j++){
            // uno de los lados del triangulo eje x entre la aprticula 1 y la 2
            const dx = particulasArray[i].x -particulasArray[j].x;
            // otro de los lados o distancia en eje Y entra la aprtocula 1 y 2
            const dy = particulasArray[i].y -particulasArray[j].y;
            //hipotenusa o distancia la raiz cuadrada de la suma de los aldos al cuadrado
            const distancia = Math.sqrt(dx * dx + dy * dy);
            if(distancia < 100){
                //cuando queremos dibujar algo nuevo en nuestro lienzo
                ctx.beginPath();
                //color del borde y define la linea que luego vamos a dibujar con el metodo stroke()
                ctx.strokeStyle = particulasArray[i].color;
                //grososr de la linea que vamos a ir dibujando 
                ctx.lineWidth = 0.2//particulasArray[i].size/20;
                //mueve el lapiz de un punto a otro desde el eje x en mi caso hasta el punto y
                //que estan gaurdados en el objeto particula creado el caul recorro y asigno 
                ctx.moveTo(particulasArray[i].x, particulasArray[i].y,);
                //crea una linea entre dos puntos x e y y mueve el lapiz generandola
                ctx.lineTo(particulasArray[j].x, particulasArray[j].y,);
                //dibuja una linea previamente definida 
                ctx.stroke();
                //cierra una linea poligonal  o linea curva
                ctx.closePath();
            }
        }
        if(particulasArray[i].size <= 0.3){
            particulasArray.splice(i, 1);
            console.log(particulasArray.length)
            i--;
        }
    }
}

//paso la funcion de actualizacion para que genere y borre lo generado
function animate() {
    //borra la pintura clear limpia y le pasamos las dimenciones del lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //pasandole un rgba genera un efecto de desgaste que es el relleno y la lenea recta 
    //ctx.fillStyle = 'rgba(0, 0, 0, .02)';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //drawCircle();
    handleParticles();
    //porcada animacion incrementamos la variable de color segun el numero que incrementemos es la velocidad de cambio de color
    hue += 2;
    requestAnimationFrame(animate);
};

animate();
