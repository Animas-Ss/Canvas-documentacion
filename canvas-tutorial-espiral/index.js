console.log("conectado.");
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//
ctx.globalCompositeOperation='destination-over';
hue = Math.random() * 360;

//cantidad de repeticiones y escala
let number = 0;
let scale = 10;


let size = 13;
//poniendo el valor de x e Y como la mitad de lato y ancho total centramos el dibujo
//let positionX = canvas.width/2;
//let positionY = canvas.height/2;
//let angle = 0;

//funcion para dibujar lo que nosotros queremos
function drawFlower() {
    //variables que van a dar forma a nuestro dibujo
    let angle = number * 5;
    let radius = scale * Math.sqrt(number);
    //para centrarlo le sumamso a la psicion la mitad del ancho y la mitad del alto
    let positionX = radius * Math.sin(angle) + canvas.width/2;
    let positionY = radius * Math.cos(angle) + canvas.height/2;


    // canvas setting.
    ctx.fillStyle = 'hsl('+ hue + ',100%, 50%)';
    ctx.strokeStyle='black';
    ctx.lineWidth = 1;
    ctx.shadowColor='black';
    ctx.shadowOffsetX=20;
    ctx.shadowOffsetY=20;
    ctx.shadowBlur=30;
    
    
    
    ctx.beginPath();
    ctx.arc(positionX, positionY, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill()
    ctx.stroke();

    number ++;
    hue += 0.5;
}


function animate() {
    // borrar lo que se iva enerando con el bucle si no lo limpio dejo el rastro
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    // comentamos todas estas lineas por que son apsadas a la funcion de dibujo que nos fasilita su implementacion
    //size += 0.1;
    //positionX += 5 *  Math.sin(angle);
    //positionY += 5 *  Math.cos(angle);
    //angle += 0.1;
    // draw each frame
    //...llamamos la funcion de dibujo
    if(number > 600) return;
    drawFlower();
    requestAnimationFrame(animate)
}

animate();

