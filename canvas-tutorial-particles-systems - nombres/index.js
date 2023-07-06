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

//todo: gradiente
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, "darkblue");// cambiamos colores
gradient.addColorStop(0.5, "white");
gradient.addColorStop(1, "lightblue");
ctx.fillStyle = gradient;
//TODO: para colocar color a las conecciones entre particulas
ctx.strokeStyle = "white";

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.floor(Math.random() * 7 + 3)//4//Math.random() * 12 + 1; // tamaño
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = -this.radius -this.effect.maxDistance - Math.random() * this.effect.height * 0.2;//this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 1 - 0.5; //velocidad y direccion
    this.vy = 0; // cambiamos esta propiedad para el movimeinto de las particulas de costado, Math.random() * 1 - 0.5; //velocidad y direccion
    //TODO: creamos una variable o propiedad que sea gravedad
    this.gravity = this.radius * 0.001;
    //TODO: velocidades cuando empujamos las aprticulas
    //OPTIMIZE: para este ejemplo de gravedad no vamos a ocupar estas lineas 
    /* this.pushX = 0;
    this.pushY = 0; */
    //TODO: ahora creamos una propiedad que es friccion para todas als particulas cuando als empujamos
    this.friction = 0.95;
    this.width = this.radius * 2;
    this.height =  this.radius * 2;
    this.color = 'white';
  }
  draw(context) {
    //context.fillStyle='red';// lo sacamos de la funcion de dibujo por cuestiones de rendimiento
    //context.fillStyle = 'hsl(' + this.x * 0.5 + ', 100%, 50%)';
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    //context.stroke();//esto modifica el color 
    if(this.effect.debug){
      context.fillStyle = this.color;
      //aca podemos sentrar la forma restandole a la pocicion el tamaño de nuestro objeto que en este caso seria el radio
      context.fillRect(this.x - this.radius, this.y - this.radius , this.radius * 2, this.radius *2);
    }
  }
  update() {
    //TODO: esto nos va a dar la nueva direccion de las aprticulas por lo cual hay una seccion si el mouse esta activado
    //TODO: las nuevas direcciones como la distancia de las lineas que unen 
    //OPTIMIZE: para este ejemplo no vamos a usar esta condicion ya que esta relacionada con el mouse 
    /* if(this.effect.mouse.pressed){
        const dx = this.x - this.effect.mouse.x;
        const dy = this.y - this.effect.mouse.y;
        const distance = Math.hypot(dx, dy);
        const force = (this.effect.mouse.radius / distance);
        if(distance < this.effect.mouse.radius){
            const angle = Math.atan2(dy, dx);
            this.pushX += Math.cos(angle) * force;
            this.pushY += Math.sin(angle) * force;
        }
    } */
    //OPTIMIZE: comentamos la operacion de friccion y push ya que no usamos en este ejemplo esas propiedades en cambio agregamos el movimeinto de gravedad
    this.vy += this.gravity;
    this.x += /* (this.pushX *= this.friction)  */+ this.vx;
    this.y += /* (this.pushY *= this.friction) + */ this.vy;

    if(this.y > this.effect.height - this.radius + this.effect.maxDistance || this.x < -this.radius -this.effect.maxDistance || this.x > this.effect.width + this.radius + this.effect.maxDistance){
      this.reset();
    } 

    //TODO: aaca vamos a desarrollar la logica y formula de colision , deteccion de colicion 
    if (
      this.x - this.radius < this.effect.element.x + this.effect.element.width &&
      this.x - this.radius + this.width > this.effect.element.x &&
      this.y < this.effect.element.y /* + this.effect.element.height  */&&
      this.y + this.height > this.effect.element.y
    ) {
      // Collision detected!
      this.color =  'red';
      this.vy *= -1;
    } else {
      // No collision
      this.color = 'blue';
    }
  }

  //TODO: para resetear cada aprtucula si se cambia el tamaño de la ventana
  reset() {
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = -this.radius - this.effect.maxDistance - Math.random() * this.effect.height * 0.2;//this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vy = 0;
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
    this.numberOfParticles = 300;
    this.maxDistance = 50;
    this.createParticles();
    //TODO: ponemos una bandera
    this.debug = true;
    //TODO: creamos una referencia  nuestro elemento en el dom en este caso un h1
    this.element = document.getElementById('caption').getBoundingClientRect();

    console.log('elemento', this.element);

    //TODO: propiedades del mouse tanto en el eje x como en el eje y
    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: 200
    };

    window.addEventListener('keydown', e => {
      if(e.key === 'd'){
        this.debug = !this.debug;
      }
    })

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
    //si colocamos la funcion de coneccion entre aprticulas abajo las conecciones aslen arriba y si lo colocamos al pincipio saldrian abajo las conexiones
    this.connectParticles(context);
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
    if(this.debug){
      context.strokeRect(this.element.x, this.element.y, this.element.width, this.element.height);
    }
  }
  connectParticles(context) {
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
    //todo: gradiente repetimos para que caundo se actualise el tamaño de la ventana tomen los mismos gradientes
    const gradient = this.context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "darkblue");
    gradient.addColorStop(0.5, "white");
    gradient.addColorStop(1, "lightblue");
    this.context.fillStyle = gradient;
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
