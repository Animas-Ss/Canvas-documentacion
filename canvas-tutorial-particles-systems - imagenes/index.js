console.log("conectado..");
//TODO: vamos a programar orientadoa  objetos .
//OPTIMIZE: setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // objeto o conteto de canvas
canvas.width = window.innerWidth; // tamaño de largo
canvas.height = window.innerHeight; // tamaño de alto
//console.log(ctx);//vemos cpor consola el objeto canvas

//TODO: dibujamos una linea de ejemplo
/* ctx.fillStyle='white';
ctx.fillRect(250, 150, 10, 100); */

//TODO: por razones de rendimiento generamos los estilos globales para que se carguen al inicio y no en cada render
//ctx.fillStyle='blue';

//todo: gradiente en este ejemplo no lo usamos 
/* const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, "white");
gradient.addColorStop(0.5, "gold");
gradient.addColorStop(1, "orangered");
ctx.fillStyle = gradient; */
//TODO: para colocar color a las conecciones entre particulas
ctx.strokeStyle = "white";

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.floor(Math.random() * 10 + 1)//4//Math.random() * 12 + 1; // tamaño
    //TODO: cambiamos las distancias y creacion de cada particula para poder completar la pantalla esta aprte se modifica
    this.imageSize = this.radius * 8;
    //cambio estas lineas por que me qeuda comprimidas mucho las imagenes this.maxDistance * 4 las pongo  * 2
    this.x =
      this.imageSize + Math.random() * (this.effect.width - this.effect.maxDistance );
    this.y =
      this.imageSize + Math.random() * (this.effect.height - this.imageSize * 2);
    this.vx = -1 //Math.random() * 1 - 0.5; //velocidad y direccion
    //this.vy = Math.random() * 1 - 0.5; //velocidad y direccion
    //TODO: velocidades cuando empujamos las aprticulas
    this.pushX = 0;
    this.pushY = 0;
    //TODO: ahora creamos una propiedad que es friccion para todas als particulas cuando als empujamos
    this.friction = 0.95;
    //OPTIMIZE: aca comienza la aprte de como poner una imagen en las particulas
    this.image = document.getElementById('star');
  }
  draw(context) {
    //context.fillStyle='red';// lo sacamos de la funcion de dibujo por cuestiones de rendimiento
    //context.fillStyle = 'hsl(' + this.x * 0.5 + ', 100%, 50%)';
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    //context.stroke();//esto modifica el color 
    //OPTIMIZE: colocamos la imagen
    //TODO: para centrar la imagen restamos la pucicion donde se encuentra en el tamaño de mi imagen que en este caso es el radio de la imagen por 8 y de alto *7 y lo multiplicamos por 0.5
    context.drawImage(this.image, this.x - (this.radius * 8) * 0.5, this.y - (this.radius * 8) * 0.5, this.radius * 8, this.radius * 8);
    
  }
  update() {
    //TODO: esto nos va a dar la nueva direccion de las aprticulas por lo cual hay una seccion si el mouse esta activado
    //TODO: las nuevas direcciones como la distancia de las lineas que unen 
    if(this.effect.mouse.pressed){
        const dx = this.x - this.effect.mouse.x;
        const dy = this.y - this.effect.mouse.y;
        const distance = Math.hypot(dx, dy);
        const force = (this.effect.mouse.radius / distance);
        if(distance < this.effect.mouse.radius){
            const angle = Math.atan2(dy, dx);
            this.pushX += Math.cos(angle) * force;
            this.pushY += Math.sin(angle) * force;
        }
    }
    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction)// + this.vy;
    //esto se modifica para que sea un efecto infinito de las imagenes
    if(this.x < -this.imageSize -this.effect.maxDistance ){
      this.x = this.effect.width + this.imageSize + this.effect.maxDistance;
      this.y = this.imageSize + Math.random() * (this.effect.height - this.imageSize * 2)
      //this.vx *= -1;
    }/* else if(this.x > this.effect.width - this.radius){
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }
    if(this.y < this.radius){
      this.y = this.radius;
      this.vy *= -1;
    }else if(this.y > this.effect.height - this.radius){
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    } */

    /* this.x += this.vx;
    if (this.x > this.effect.width - this.radius || this.x < this.radius) {
      this.vx *= -1;
    }
    this.y += this.vy;
    if (this.y > this.effect.height - this.radius || this.y < this.radius) {
      this.vy *= -1;
    } */
 
  }

  //TODO: para resetear cada aprtucula si se cambia el tamaño de la ventana
  reset() {
    //TODO: modificamos el reset asi caundo modificamos als estrellas o particulas con el mouse vuelven a ser iguales caundo empeizan desde el brode de la pantalla
    this.x =
    this.imageSize + Math.random() * (this.effect.width - this.effect.maxDistance * 4);
  this.y =
    this.imageSize + Math.random() * (this.effect.height - this.imageSize * 2);
/*     this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - this.radius * 2); */
  }
}

class Whale {
  constructor(effect){
    this.effect = effect;
    this.imageSizeX = 400;
    this.imageSizeY = 300;
    this.x = this.effect.width * 0.4;
    this.y = this.effect.height * 0.5;
    this.image = document.getElementById("cangrejo");
  }
  draw(context){
    context.drawImage(this.image, this.x - this.imageSizeX * 0.5, this.y - this.imageSizeY * 0.5, this.imageSizeX, this.imageSizeY);
  }
}

class Effect {
  constructor(canvas, context) {
    this.canvas = canvas;
    //TODO: agregamos el context movilidad , interaccion con las aprticulas
    this.context = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    //Array de las particulas va a almacenar las particulas creadas
    this.particles = [];
    this.numberOfParticles = 200;
    this.maxDistance = 90;
    this.createParticles();
    //TODO: llamamos a la clace que creamos apra pocicionar la imagen
    this.cangrejo = new Whale(this);
    //TODO: propiedades del mouse tanto en el eje x como en el eje y
    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 200
    };

    //TODO: evento para la interaccion con las aprticuas este evento es para detectar el cambio de ventana
    window.addEventListener("resize", (e) => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
    });
    //TODO: eventos para el mouse
    window.addEventListener("mousemove", (e) => {
        if(this.mouse.pressed){
            console.log(e.x, e.y);
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        }
    });

    //TODO: eventos para el mouse
    window.addEventListener("mousedown", (e) => {
      this.mouse.pressed = true;
    });
    //TODO: eventos para el mouse
    window.addEventListener("mouseup", (e) => {
      this.mouse.pressed = false;
    });
  }
  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  handleParticles(context) {
    this.cangrejo.draw(context);// si colocamos esta linea de codigo arriba o abajo va a estar arriba o abajo de las estrellas
    //si colocamos la funcion de coneccion entre aprticulas abajo las conecciones aslen arriba y si lo colocamos al pincipio saldrian abajo las conexiones
    this.connectParticles(context);
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
  connectParticles(context) {
    //const maxDistance = 50;//cantidad de uniones o conecciones si modificamos esto se modifican als conecciones
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        // para calcular la distancia usamos el ejemplo de la hypotenusa de un triangulo rectangulo
        const dx = this.particles[a].x - this.particles[b].x; // distancia sobre el eje X del punto a al punto b
        const dy = this.particles[a].y - this.particles[b].y; // distancia sobre el eje Y del punto a al punto b
        const distance = Math.hypot(dx, dy); // calculo de la hipotenusa
        if (distance < this.maxDistance) {
          context.save();
          //creamos una opacidad usando la logica de dividir la distancia y restarte a la unidad esa resta
          const opacity = 1 - distance / this.maxDistance; // esto nos da un numeto sercano a uno 1 es completamente visible y 0 invisible
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(this.particles[a].x, this.particles[a].y);
          context.lineTo(this.particles[b].x, this.particles[b].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }
  //TODO: aca comenzamos a interactuar con las aprticulas
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.cangrejo.x = this.width * 0.4;
    this.cangrejo.y = this.height * 0.5;
    //todo: gradiente repetimos para que caundo se actualise el tamaño de la ventana tomen los mismos gradientes
    /* const gradient = this.context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.5, "gold");
    gradient.addColorStop(1, "orangered");
    this.context.fillStyle = gradient; */
    //TODO: para colocar color a las conecciones entre particulas repetimos
    this.context.strokeStyle = "white";
    //recorremos las aprticulas y usamos su propiedad reset
    this.particles.forEach((particle) => {
      particle.reset();
    });
  }
}

const effect = new Effect(canvas, ctx);
console.log(effect);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  requestAnimationFrame(animate);
}

animate();
