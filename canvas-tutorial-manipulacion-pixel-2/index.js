
window.addEventListener('load', function () {

    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //clase particula el objeto que nso dara cada mini particula que nosotros queramos
    class Particle {
       /*  la particula va a tener:
        direccion o posision con el eje X e y
        un tamaño size */
        constructor(effect){
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.size = 3;
            //direccion de las particulas con su velocidad
            this.vx = Math.random() * 2 -1;
            this.vy = Math.random() * 2 -1;
        }
        //aca creamos el metodo de dibujo que va a definir la ubicacion de la particula y tambien la forma
        draw(context){
            //como vamos a usar las pripiedades del objeto usamos el this
            context.fillRect(this.x, this.y, this.size, this.size);
        }
        update(){
            this.x += this.vx;
            this.y += this.vy;
        }
    }
    
    //clase efecto que nos va a dar la movilidad o efectoq ue queramos en cada aprticula
    class Effect {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.particleArray = [];
            this.image = document.getElementById('image1');
            //para centrar el elemento
            this.centerX = this.width * 0.5;
            this.centerY = this.height * 0.5;
            this.x = this.centerX - this.image.width * 0.5;
            this.y = this.centerY - this.image.height * 0.5;
        }
        init(){
            for(let i = 0; i < 100 ; i++){
                this.particleArray.push(new Particle(this))
            }
        }
        draw(context){
            this.particleArray.forEach(particle => particle.draw(context))
            context.drawImage(this.image, this.x, this.y);
            
        }
        update(){
            this.particleArray.forEach(particle => particle.update())

        }
    }

    const effect = new Effect(canvas.width, canvas.height);
    effect.init();

    console.log(effect)

    // funcion de animacion la que va a desencadenar el lop infinito de movimiento 
    function animate(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        effect.draw(context)
        effect.update();
        requestAnimationFrame(animate)
    }

    animate();

});

