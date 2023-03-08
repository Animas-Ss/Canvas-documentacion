console.log("conectado..");
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//global configuraciones
ctx.lineWidth = 10;
//ctx.strokeStyle = 'magenta';

//canvas shadow
//ctx.shadowOffsetX=2;
//ctx.shadowOffsetY=2;
//ctx.shadowColor='white';



//dradient
const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient1.addColorStop('0.2', 'pink');
gradient1.addColorStop('0.3', 'red');
gradient1.addColorStop('0.4', 'yellow');
gradient1.addColorStop('0.5', 'orange');
gradient1.addColorStop('0.6', 'green');
gradient1.addColorStop('0.7', 'violet');
gradient1.addColorStop('0.8', 'red');



//parnert
const imgparnet = document.getElementById('imgparnnet');
const parnet1 = ctx.createPattern(imgparnet, 'no-repeat');

ctx.strokeStyle = 'yellow';

class Line {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        //this.endX = Math.random() * canvas.width;
        //this.endY = Math.random() * canvas.height;
        this.history = [{ x: this.x, y: this.y }];
        this.lineWidth = Math.floor(Math.random() * 25 + 1);
        this.hue = Math.floor(Math.random() * 360);
        this.maxLength = Math.floor(Math.random() * 150 + 10);
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = 3;
        this.lifeSpan = this.maxLength * 3;
        this.brackPoint = this.lifeSpan * 0.90;
        this.timer = 0;
        this.angle = 0;
        this.va = Math.random() * 0.5 -0.25;
        this.curve = 0.1;
        this.vc = Math.random() * 0.4 -0.2;
        //this.vc = 0.05
    }
    draw(context) {
        //context.strokeStyle = 'hsl(' + this.hue + ', 100%, 50%)';
        context.lineWidth = this.lineWidth
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        //for(let i = 0; i < 30; i++){
         //   this.x = Math.random() * this.canvas.width;
         //   this.y = Math.random() * this.canvas.height;
         //   this.history.push({x: this.x, y:this.y})
        //}
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y);
        }
        context.stroke();
    }
    update() {
        this.timer++;
        //this.angle += 0.1;
        this.angle += this.va;
        this.curve += this.vc;
        if (this.timer < this.lifeSpan) {
            if(this.timer > this.brackPoint){
                this.va *= -1;
            }
            //this.x = Math.random() * this.canvas.width;
            //this.x += this.speedX + Math.random() * 20 - 10;
            this.x += Math.sin(this.angle) * this.curve;
            //this.y = Math.random() * this.canvas.height;
            //this.y += this.speedY + Math.random() * 20 - 10;
            //this.y += this.speedY;
            //this.y += Math.sin(this.angle) * this.curve;
            this.y += Math.cos(this.angle) * this.curve;


            this.history.push({ x: this.x, y: this.y })
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }
        }else if(this.history.length <= 1){
            this.reset();
        }else {
            this.history.shift();
        }
    }
    reset(){
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.history = [{ x: this.x, y: this.y }];
        this.timer = 0;
        this.angle = 0;
        this.curve = 0;
    }
}

const linesArray = [];
const numbersOfLines = 150;
for (let i = 0; i < numbersOfLines; i++) {
    linesArray.push(new Line(canvas))
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw line
    linesArray.forEach(line => {
        line.draw(ctx)
        line.update()
    });
    //update line
    requestAnimationFrame(animate);
}
animate();
