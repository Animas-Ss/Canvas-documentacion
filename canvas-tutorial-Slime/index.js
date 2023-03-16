const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log("conectado");

//setting canvas
ctx.fillStyle='pink';



// clace de las bolas
class Bolas {
    // referencia como parametro a meta effecto
    constructor(effect){
        this.effect = effect ;
        this.radius = Math.random() * 120 + 30;
        // canbiamos ña propiedad x e y para efecto de caida
        //this.x = this.effect.width * 0.5;
        this.x = this.radius * 2 + (Math.random() * this.effect.width - this.radius * 4);
        //modificamos el eje Y
        //this.y = this.effect.height * 0.5;
        this.y = -this.radius;
        // pra generrar un movimiento aleatorio usamos el Math.random() si restamos en lo que queremos la direccion de movimeinto
        //es mas aliatoria para todos los sentidos 
        //this.speedX = 1;
        this.speedX = Math.random() * 0.2 - 0.1;
        //modificamos la velocidad en el eje Y
        //this.speedY = Math.random() - 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        //estas propiedades nos sirve apra ahcer un efec to humo smoke
        this.angle = 0;
        this.va = Math.random() * 0.1 - 0.05;
        this.range = Math.random() * 30;
        //vamos a crear gravedad
        this.gravity = Math.random() *  0.005;
        this.vy = 0;

    }
    //para producir el movimiento usams el metodo update
    update(){
        //esta validacion nos sirve apra que las bolas no se vallan del lienzo 
        // si la validacion le agregamos el radio de nuestra bola rebota justo cuando la bola toca
        if(this.x < this.radius || this.x > this.effect.width - this.radius) this.speedX *= -1;
        //hag lo mismo para el eje Y
        //if(this.y < this.radius || this.y > this.effect.height - this.radius) this.speedY *= -1;
        //modificamos la condicion para que el movimeinto o efecto sea otro
        if(this.y > this.effect.height - this.radius){
            //agregamos esto para el efecto de caida
        this.radius = Math.random() * 120 + 30;

            this.y = -this.radius;
            this.vy = 0;
            this.speedY = Math.random() * 1.5 + 0.5;
            //se agrega apra el efecto de caida
        this.x = this.radius * 2 + (Math.random() * this.effect.width - this.radius * 4);

        }
        if(this.y > this.radius){
            this.vy += this.gravity;
            this.speedY = this.vy;
        }

        // generamos un movimeinto aliatorio del angulo 
        //this.angle += this.va; lo comentamos apra generar el movimeinto de caida no es necesario este valor
        //this.x += this.speedX * Math.cos(this.angle) * this.range;// esto lo comentamos pro que sacamos el valor relacionado al angulo
        this.x += this.speedX;
        //this.y += this.speedY * Math.sin(this.angle) * this.range;// misma razon ya no necesitamos el cos ni el seno por que no usamos el angulio
        this.y += this.speedY;
    }
    // lo que se va a dibujar con el medoto draw pasamos de parametro context que seria el ctx
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
    reset(){
        this.x = this.effect.width * 0.5;
        this.y = this.effect.height * 0.5;
    }

}

//manejador de los efectos
class MetaEfecto {
    constructor(width, height){
        //tomamos el tamaño del lienzo o pantalla
        this.width = width;
        this.height = height;
        //creamos un array que vamos a llenar con las bollas que creamos
        this.metaballsArrays = [];
    }
    //inicializar el efecto vamos a pasar de argumento la cantidad de bolas que queremos
    init(numberOfBalls){
        //creamos la cantidad de elementos Bolas que queremos y pasamos como parametro toda la clace MetaEfecto this
        for(let i= 0; i < numberOfBalls; i++){
            this.metaballsArrays.push(new Bolas(this));
        }
    }
    //metodo para actualizar cada elemento
    update(context){
        this.metaballsArrays.forEach((metaball) => metaball.update());
    }
    //dibujar elementos con efecto
    draw(context){
        //luego de llegar a este metodo el argumento es trasladado al metodo draw pero de la clace bolas y se pasa el contexto 2d a cada bola que este en el array creado
        this.metaballsArrays.forEach(metaball => metaball.draw(context));
    }
    //para cambiar nuestra clace o paa que se resetee caudno cambia la pantalla
    reset(newWidth, newHeight){
        this.width = newWidth;
        this.height = newHeight;
        //volvemos a recorrer nuestro array para enviarles como arumento el nuevo ancho de la ventana
        this.metaballsArrays.forEach(metaball => metaball.reset());

    }
}
// creamos una constante con el objeto efecto creado
const effect = new MetaEfecto(canvas.width, canvas.height);
effect.init(20);
//console.log(effect); comento esta linea por que era para ver si los objetos se habian creado correctamente 


//funcion de la animacion 
function animate(){
    // si no generamos una limpieza de lo que ya se creo no se genera un movimeinto limpio sino deja una stela por cada pixel que se mueve
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    effect.update();
    //este metodo esta relacionado con el metodo dibujar de la clace bolas por lo cual paso todo el objeto contexto 2d
    effect.draw(ctx)
    //hacems un loop infinito para crear la animacion
    requestAnimationFrame(animate)
}
// llamo la funcion apra que comienze la animacion 
animate();

//evento de cambio de dimenciones de ventanas

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'white';
    effect.reset(canvas.width, canvas.height);
})