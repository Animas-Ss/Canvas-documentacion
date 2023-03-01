console.log("conectado");

const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// creamos una variable local para darle un gradiente a mi efecto
//createLinearGradient(startX, startY, endX, endY) desde donde empieza el gradiente a donde termina le damos la direccion para donde va a ir degradando
//let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//si queremos invertir la direccion invertimos los valores
//let gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
//el metodo createRadialGradient(x1, y1, r1, x2, y2, r2) 6 parametros
let gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, canvas.width / 2);
gradient.addColorStop(0, 'red');
gradient.addColorStop(0.5, 'cyan');
gradient.addColorStop(1, 'magenta');
//cantidad de colores del gradiente
//gradient.addColorStop(0, 'red');
//gradient.addColorStop(0.2, 'yellow');
//gradient.addColorStop(0.6, 'cyan');
//gradient.addColorStop(0.4, 'green');
//gradient.addColorStop(0.8, 'blue');
//gradient.addColorStop(1, 'magenta');

// creamos una clace para los simbolos con un costructor el cual va a tener 
// x = el ancho de la ventana o lienzo
// y = alto de la ventana o lienzo
//fontSize el tamaño de la fuente
//
class Symbol {
    constructor(x, y, fontSize, canvasHeight) {
        this.character = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasHeight = canvasHeight;
    }
    draw(context) {
        this.text = this.character.charAt(Math.floor(Math.random() * this.character.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
        if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98) {
            this.y = 0;
        } else {
            this.y += 1;
        }
    }

};

//clace con efecto para darle las configuraciones eh inicializarla
class Effect {
    // le pasamos un ancho y un alto al efecto
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        //tamaño de letra
        this.fontSize = 15;
        // cantidad de columnas lo calculamos el cnacho de la pantalla dividida en el tamaño de feunte
        this.columns = this.canvasWidth / this.fontSize;
        //inicializamos con un array o matriz vacio para formar las lineas a mostrar
        this.Symbols = [];
        //inicializamos metodo oculto
        this.#initialize();
        console.log(this.Symbols);
    }
    #initialize() {
        //recorremos segun el canculo de columnas y cargamos segun ese numero el array de Symbolos creadondo un objeto
        //un objeto simbolo por cada vuelta hasta acabar con la cantidad de columnas disponibels segun el ancho de la pantalla
        for (let i = 0; i < this.columns; i++) {
            //este nuevo objeto que creamos y cargamos en la matriz esta en una posicion segun el recorrido x se va moviendo con respecto a el eje Y es cero pr que no se mueve de arriba 
            //que es el borde de la pantalla
            //pasamos el tamaño y el alto de la pantalla o lienzo
            this.Symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
        }
    }
    // este metodo lo creamos para poder actualizar por el cambio de pantalla los valores tanto de los anchos y altos como la cantidad de columnas necesarias
    resize(width, height) {
        this.canvasHeight = height;
        this.canvasWidth = width;
        this.columns = this.canvasWidth / this.fontSize;
        this.Symbols = [];
        this.#initialize();
    }
};
// inicializamos el efecto y lo guardamos en una variable llamada effec con minuscula para poder despues usar esa instancia 
//y modificarla
const effect = new Effect(canvas.width, canvas.height);
//para generar una variable de tiempo 
let lastTime = 0;
//estos fps me van a servir para ajustar a mi gusto a velocidad ya que en la linea siguiente la uso para 
//dividir los milisegundos y usarlos despues en la funcion animate()
const fps = 160;
const nextFrame = 1000 / fps;
//inicializo timer 
let timer = 0;

//pasamos un argumento de tiempo
function animate(timeStamp) {
    //declaramos una variable apra hacer el calculo del delta tiempo
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > nextFrame) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.textAlign = 'center';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = gradient//'#0aff0a';
        ctx.font = effect.fontSize + 'px monospace';
        effect.Symbols.forEach(symbol => symbol.draw(ctx));
        timer = 0;
    } else {
        timer += deltaTime;
    }
    requestAnimationFrame(animate);
};

animate(0);

window.addEventListener('resize', function () {
    //para escuchar el cambio de pantalla e ir guardando los nuevos valores
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //llamo a la variable con la que inicialize mi clace Effect y le paso a su metodo resize el ancho y el alto de la pantalla
    effect.resize(canvas.width, canvas.height);
    gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'cyan');
    gradient.addColorStop(1, 'magenta');
});