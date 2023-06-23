console.log('conectado.');

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
/* canvas.width = window.innerWidth;
canvas.height = window.innerHeight; */
//para que las fibras creadas tengan relacion con las letras tenemso que definir un lienzo concreto en darle una altura y ancho fijo
canvas.width = 1500;
canvas.height = 500;

//canvas settings
console.log(ctx);
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineCap = 'round';

//una linea con canvas en el lienzo
/* ctx.beginPath();
ctx.moveTo(100, 200);
ctx.lineTo(400, 500);
ctx.stroke() */;


// clace de la aprticulas con sus propiedades o variables y metodos
class Particle {
    constructor(effect) {
        this.effect = effect;
        //direccion de la aprticula toma el tamaño del lienzo pero de forma aliatoria unsamos Random y para que este sea entero llamamos a la funcion floor
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        //para generar un movimiento colocamos velocidades
        //si el objetivo es darle un movimiento aliatorio usamos el metodo ramdon del objeto Math
        // al multiplicarlo le damos un control de hasta ese numero y si sumamos o restamos un rango mas
        this.speedX;// = Math.random() * 5 - 2.5;tenian esta igualdad pero despues se sobre escriben abajo asi que iniciarlas es suficiente
        this.speedY;//= Math.random() * 5 - 2.5;
        //agregamos una propiedad que modifique la velocidad de forma aliatoria para multiplicarla por las velocidades speedXe Y
        this.speedModifier = Math.floor(Math.random() * 2 + 1);//Math.random() * 5 +1 valor original del proyecto
        //creamos una matriz que guarde la posicion 
        this.history = [{ x: this.x, y: this.y }];
        //la longitud maxima de la linea que va a seguir la aprticula en este caso ponemos un numero aliatorio
        this.maxLength = Math.floor(Math.random() * 60 + 50);
        //para aplicar trigonometria
        this.angle = 0;
        // creamos otras propiedades para relacionarlas con el angulo de cada particula
        this.newAngle = 0;
        // para que no tenga una direccion determinada y se mueva en diferentes direcciones lo acemos radom 
        this.angleCorrector = Math.random() * 0.5 + 0.01;
        //agregamos una variable de tiempo y la igualamos a la longitud de la linea + 2 para que sea el doble
        this.timer = this.maxLength * 2;
        this.colors = ['#4c026b', '#730d9e', '#9622c7', '#b44ae0', '#cd72f2']
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    draw(context) {
        //sacamos el fillrect para que solo quede la linea de la aprticula
        //context.fillRect(this.x, this.y, 10, 10);
        // creamos una linea que va a seguir el recorido de nuestra particula
        context.beginPath();
        // va a empezar desde la primera pocicion donde se crea la particula y seguirla por su direccion
        //por eso colocamos el indice 0 de cada eje
        context.moveTo(this.history[0].x, this.history[0].y);
        //recoremos la matriz de posiciones que creamos llamada history
        for (let i = 0; i < this.history.length; i++) {
            //colocamos el metodo apra marcarle donde mover la linea creada
            context.lineTo(this.history[i].x, this.history[i].y);
            
        }
        //para ponerle color a las lineas creadas
        context.strokeStyle = this.color;
        //finalizamos con stroke para pintar la linea creada
        context.stroke();
    }
    update() {
        //vamos a ir decrementando el tiempo inicial para poder hacer una condicion de actualizacion
        this.timer--;
        //condicion vamos a meter todo el codigo siguiente en esta condicion
        if (this.timer >= 1) {
            // ubicamos la particula en nuestra cuadricula
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y * this.effect.cols + x;
            //para ir incrementando el angulo de cada particula
            //this.angle += 0.5;

            // vamos a colocar el codigo la propiedad angle dentro de un if que nos va a dar si el index existe o no
            if (this.effect.flowsField[index]) {
                this.newAngle = this.effect.flowsField[index].colorAngle;
                if (this.angle > this.newAngle) {
                    this.angle -= this.angleCorrector;
                } else if (this.angle < this.newAngle) {
                    this.angle += this.angleCorrector;
                } else {
                    this.angle = this.newAngle;
                }
            }
            //la direccion del movimiento de nuestras particulas determinadas
            //por la velocidad aplicada en el eje x y en el eje y 
            //esta direccion canbia sumando o multiplicando por factores matematicos como seno coseno
            //numeros aliatorios etx
            //this.x += this.speedX + Math.random() * 15 -7.5;
            //this.y += this.speedY + Math.random() * 15 -7.5;
            //this.x += this.speedX + Math.sin(this.angle) * 30;
            //this.y += this.speedY + Math.cos(this.angle) * 20;
            this.speedX = Math.cos(this.angle) * this.speedModifier;//speedModifier ara que unaslineas se muevan lento y otras mas rapido 
            this.speedY = Math.sin(this.angle) * this.speedModifier;
            this.x += this.speedX;
            this.y += this.speedY;

            //cargamos nuestro array de mopociones con cada actualizacion 
            this.history.push({ x: this.x, y: this.y });
            //vamos a definir una condicion que nos permita determinar la logitud de la linea generada por la particula
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }

        } else if (this.history.length > 1) {
            this.history.shift();
        } else {
            this.reset();
        }

    }
    reset() {
        //creamos variables de reseteo para generar un control dentro de las particulas que estan dentro de las letras
        let attempts = 0;
        let resetSuccess = false;

        while (attempts < 10 && !resetSuccess) {
            attempts++;
            let testIndex = Math.floor(Math.random() * this.effect.flowsField.length);
            if (this.effect.flowsField[testIndex].alpha > 0) {
                //asignacmos la rirecciones de las particulas a las direcciones que creamos con el escaneo de nodos
                //y guardamos en flowField nuestra matis de escaneo y direcciones
                this.x = this.effect.flowsField[testIndex].x;
                this.y = this.effect.flowsField[testIndex].y;
                this.history = [{ x: this.x, y: this.y }];
                this.timer = this.maxLength * 2;
                //cambiamos el resetSuccess a verdadero
                resetSuccess = true;
            }
        }
        // colocamos una validaion para desaparecer el resto de las aprticulas 
        if(!resetSuccess){
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.history = [{ x: this.x, y: this.y }];
            this.timer = this.maxLength * 2;
        }
        // bloque original para tener particulas por toda la pantalla queda comentada por el proyecto de particulas en letras
        /* this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.history = [{x: this.x, y: this.y}];
        this.timer = this.maxLength * 2;*/
    
    } 
 }

// clace y efectos, que sera el cereblo principal de nuestro poposito
class Effect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        // me aseguro que el constructor de la clace tenga todo el contexto de canvas
        this.context = ctx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        // cambio para generar el numero de estelas o particulas
        this.numberOfParticles = 1000;
        //vamos a definir una cuadricula y usar filas columnas y el tamaño de la celda osea del cuadrado
        this.cellSize = 5;
        this.rows;// se van a definir segun el calculo del ancho del lienzo por el tamaño de la celda
        this.cols;// igual que las filas va a ser un calculo
        this.flowsField = [];
        //vamos a agregar la cuerva deseada // inicial 0.5 pero cambiamos a 2.1 y hagarra otra forma
        this.curve = 5;
        //vamosa  agrega rel zoom deseado o cantidad de lineas generadas al ser mas grandes o mas chicas 
        //ejemplo 0.2 solo se muestra una guia para las lineas 0.8 cuatro guias
        this.zoom = 0.07;
        //variable para ver la cuadricula
        this.debug = true;
        //ponemos el metodo init para que inicie apenas crememos una instancia de la clace effec
        //como es de la misma clace lo llamams al metodo init() con el this
        this.init();

        // evento que captura cuando preciono una tecla permite cambiar el valor de debuf para poner o sacar al cuadricula
        window.addEventListener('keydown', e => {
            if (e.key === 'd') this.debug = !this.debug;
        });
        // evento para el ajuste de la ventana
        window.addEventListener('resize', e => {
            console.log(e)
            console.log(e.target.innerHeight, e.target.innerWidth);
            this.resize(e.target.innerWidth, e.target.innerHeight);
        })
    }
    //metodo de forma de texto
    drawText() {
        // fuente y tamaño
        this.context.font = '450px Impact';
        //alineacion ancho
        this.context.textAlign = 'center';
        //aliniacion alto
        this.context.textBaseline = 'middle';
        // gradiente
        const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
        gradient1.addColorStop(0.2, 'rgb(255, 255, 255)');
        gradient1.addColorStop(0.4, 'rgb(255, 255, 120)');
        gradient1.addColorStop(0.6, 'rgb(100, 100, 100)');
        gradient1.addColorStop(0.8, 'rgb(0, 0, 255)');

        const gradient2 = this.context.createRadialGradient(this.width * 0.5, this.height * 0.5, 10, this.width * 0.5, this.height * 0.5, this.width);
        gradient2.addColorStop(0.2, 'rgb(0, 0, 255)');
        gradient2.addColorStop(0.4, 'rgb(200, 255, 0)');
        gradient2.addColorStop(0.6, 'rgb(0, 0, 255)');
        gradient2.addColorStop(0.8, 'rgb(0, 0, 0)');


        //color de texto
        this.context.fillStyle = gradient2;
        //texto que queremos poner y separacion 
        this.context.fillText('FLOW', this.width * 0.5, this.height * 0.5, this.width * 0.8);
    }
    //metodo de inicializacion
    init() {
        //create flow field
        this.rows = Math.floor(this.height / this.cellSize);// calculo de las filas
        this.cols = Math.floor(this.width / this.cellSize);//calculo de columnas
        this.flowsField = [];// para resetear los valores

        //draw text - o dibujo de texto
        this.drawText()

        //scanear los pixeles y vincularlos con las letras
        // brebe explicacion los aprametros es lo que queremos que escanee osea desde el punto 0 , 0 y todo el tamaño del lienzo por eso ponemos todo el width y heught
        // lo guardamos en una costante a el escaneo
        const pixels = this.context.getImageData(0, 0, this.width, this.height).data;
        console.log(pixels);
        //recorrido vertical eje Y
        for (let y = 0; y < this.height; y += this.cellSize) {
            //recorrido horizontal eje X
            for (let x = 0; x < this.width; x += this.cellSize) {
                const index = (y * this.width + x) * 4;//obtenemos el indice del nodo y de ahi cada color de dicho nodo
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                // creamos una constante para la escala de grises los colores grises tiene los tres terminos iguales red, green,blue
                const grayscale = (red + green + blue) / 3;
                //toFixed es una propiedad de javascript que me permite determina la cantidad de decimales que puedo tomar del numero flotante
                const colorAngle = ((grayscale / 255) * 6.28).toFixed(2)// se divide el valor de la escala de grises en la tonalidad maxima que cada termino puede conseguir que es de 255 esto lo multiplicacmos por 6.28 radiones que son dos PI seria toda la circunferencia de un circulo
                this.flowsField.push({
                    x: x,
                    y: y,
                    alpha: alpha,
                    colorAngle: colorAngle
                });

            }

        }


        // comento esta aprte para agregar unos for en el escaneo de pixels
        /*  for(let y = 0; y < this.rows; y++){
             for(let x = 0; x < this.cols; x++){
                 //creamos un valor llamado angulo el cual va a ser con el recorrido
                 //se agrega la multiplicacion se gun por lo que multipliquemos es el movimeinto de la estela o linea creada
                 //para acerlo automatico generaos una variable llamada curva y multiplicamos por ella
                 //tambien multiplicamos la posicion x e y del seno y coseno para generar movimientos
                 // que tambien la remplazamos por una variable asi toma su valor
                 let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                 // llenamos con el valor del angulo nuestro arreglo
                 //todos los cuadros van a tener un valor osea el valor de un angulo
                 this.flowsField.push(angle);
             }
         } */
        //generamos la cantidad de particulas que nuestra variable diga numberOfParticles
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            // colocamos en el array una nueva aprticula y paso como parametro todo el objeto
            this.particles.push(new Particle(this));
        }
        this.particles.forEach(particle => particle.reset())
    }
    drawGrid() {
        for (let c = 0; c < this.cols; c++) {
            this.context.beginPath();
            this.context.moveTo(this.cellSize * c, 0);
            this.context.lineTo(this.cellSize * c, this.height);
            this.context.stroke();
        }
        for (let r = 0; r < this.rows; r++) {
            this.context.beginPath();
            this.context.moveTo(0, this.cellSize * r);
            this.context.lineTo(this.width, this.cellSize * r);
            this.context.stroke();
        }
        this.context.restore();
    }
    //metodo rezise para modificacion de ventana , el argumento viene del evento resize donde paso el evento de la ventana
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        //asignacion de variables 
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.init();
    }
    //renderizar las particulas
    render() {
        //llamamos al metodo drawgrid ponemos una propiedad para pode rocultarlo o mostarar la cuadrigula
        if (this.debug) {
            this.drawGrid();
            // colocamos la llamada a nuesto emtodo texto
            this.drawText();
        }
        //recorremos el arreglo que estamso cargando de particulas
        this.particles.forEach(particle => {
            //llamamos al metodo draw de la particula creada 
            particle.draw(this.context);
            // para generar el movimiento llamamos a dentro del recorrido el metodo update de las aprticulas
            //que es la habilidad de las particulas de moverse viste de la perspectiva de objeto 
            // un objeto llamado particula con la habilidad de moverse
            particle.update();
        })
    }
}

//paso como argumento canvas que es el tamaño del lienzo para poder modificarla o asignarla a width y height
const effect = new Effect(canvas, ctx);
//paso el argumento que espera que es todo el contexto

console.log(effect, ctx);

function animate() {
    //para limpiar lo dibujado en el lienzo y no producir un efecto no querido usamos el metodo clearRect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //llamamos el petodo render desde este loop para que se genere una animacion
    effect.render();
    //animate quiere generar este loop por eso llamamos a la misma funcion
    requestAnimationFrame(animate);
}
animate();