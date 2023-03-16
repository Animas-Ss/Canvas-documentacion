const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


//ctx.fillStyle = 'green';
//
ctx.lineWidth = 3;
ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.shadowBlur = 10;
ctx.shadowColor = 'blue';
let hue = 0;
let drawing = true;
//ctx.globalCompositeOperation='destination-over';


function drawShape(x, y, radius, inset, n) {
    //ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    ctx.beginPath();

    ctx.save();
    ctx.translate(x, y);
    
    ctx.moveTo(0, 0 - radius);
    for(let i = 0; i < n; i++){
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0 - (radius * inset));
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, 0- radius);
    }
    

    ctx.restore();

    ctx.closePath();
    ctx.stroke();
    ctx.fill();

}
const radius = 30;
const inset = 0.4;
const n = 2;

//drawShape(100, 1 , 2.5);
drawShape(120, 120, radius * 1.45, 1, 1.5);
drawShape(120, 120, radius, inset, n);

let angle = 0;
window.addEventListener('mousemove', function(e){
    if(drawing){
        ctx.save();
        ctx.translate(e.x, e.y);

        ctx.rotate(angle);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        drawShape(0, 0, radius, 1, 3);

        ctx.rotate(angle * 4);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        drawShape(radius, radius, radius * 0.35, 1, 5);

        ctx.rotate(-angle * 4);
        ctx.fillStyle = 'yellow';
        drawShape(radius, radius, radius * 0.35, 1, 5);


        //hue += 3;
        angle += 0.1;
        ctx.restore();
    }
});

window.addEventListener('mousedown', function(){
    drawing = true;
});

window.addEventListener('mouseup', function(){
    drawing = true;
});