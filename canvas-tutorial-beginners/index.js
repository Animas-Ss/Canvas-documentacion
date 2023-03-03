
// evento de carga de la pagina
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //canvas setting
    ctx.fillStyle = 'green';
    //ctx.strokeStyle = 'gold';

    //bordes redondos
    ctx.lineCap = 'round';
    //color de sombra
    ctx.shadowColor = 'rgba(0,0,0, 0.7)';
    //sombras direcciones y distorcion
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;


    //efecto setting
    let size = canvas.width < canvas.height ? canvas.width * 0.2 : canvas.height * 0.2;
    const maxLevel = 8;
    const branches = 2;

    let sides = 5;
    let scale = 0.7;
    let spread = 0.6;
    let color = 'hsl('+ Math.random() * 360 +', 100%, 50%)';
    let lineWidth = Math.floor(Math.random() * 20 +10);

    //controls
    const randomizeButton = document.getElementById('randomizeButton');
    const resetButton = document.getElementById('resetButton');
    const slider_spread = document.getElementById('spread');
    const label_spread = document.querySelector('[for="spread"]');

    slider_spread.addEventListener('change', function(e){
        //console.log(e.target.value);
        spread = e.target.value;
        updateSliders()
        drawFractal();
    })

    slider_sides = document.getElementById('sides');
    label_sides = this.document.querySelector('[for="sides"]');
    slider_sides.addEventListener('change', function(e){
        sides = e.target.value;
        updateSliders()
        drawFractal();
    });

    let pointX = 0;
    let pointY = size;

    function drawBranch(level){
        if(level > maxLevel) return;
        ctx.beginPath();
        //punto de donde voy a comenzar a marcar mi linea con cordenadas x e y en este caso la mitad de la pantalla
        ctx.moveTo(pointX,pointY);
        // punto hasta donde va a llegar la linea con cordenadas x e y 
        //ctx.lineTo(size,0);
        ctx.bezierCurveTo(0, size * spread * -3, size * 5, size * 10 * spread, 0, 0);
        ctx.stroke();

        for(let i = 0; i < branches; i++){
        ctx.save();
        //ctx.translate(size -(size/branches) * i, 0);
        ctx.translate(pointX, pointY)
        ctx.scale(scale, scale);

        ctx.save()
        ctx.rotate(spread);
        drawBranch(level + 1);
        ctx.restore();

        //ctx.save();
        //ctx.translate(size -(size/branches) * i, 0);
        //ctx.rotate(-spread);
        //ctx.scale(scale, scale);
        //drawBranch(level + 1);
        //ctx.restore();


        ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(-size/2, 0, 50,0, Math.PI *2);
        ctx.fill();

    }



  function drawFractal(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
        // ancho de liinea
        ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.translate(canvas.width/2, canvas.height/2);
    //ctx.scale(1, 1); no hacen nada estan configurados previamente
    //ctx.rotate(0);
    //ctx.fillRect(0,0, canvas.width, canvas.height);
    for (let i = 0; i < sides; i++) {
        ctx.rotate((Math.PI * 2)/sides);
        //ctx.scale(0.97, 0.97);
        //ctx.translate(30, 30);
        drawBranch(0);
    }
    ctx.restore();
  }
 drawFractal();

 function randomizeFractal (){
    sides = Math.floor(Math.random() * 7 + 2);
    scale = Math.random() * 0.4 + 0.4;
    spread = Math.random() * 2.9 + 0.1;
    color = 'hsl('+ Math.random() * 360 +', 100%, 50%)';
    lineWidth = Math.floor(Math.random() * 20 +10);
 }

   randomizeButton.addEventListener('click', function(){
       randomizeFractal();
       updateSliders()
       drawFractal();
   });

   function resetFractal(){
    sides = 5;
    scale = 0.5;
    spread = 0.7;
    color = 'hsl(290, 100%, 50%)';
    lineWidth = 15;
   }

   resetButton.addEventListener('click', function(){
    resetFractal()
    updateSliders()
    drawFractal();
   })

   function updateSliders(){
    slider_spread.value = spread;
    label_spread.innerText = 'Spread: ' + Number(spread).toFixed(2);
    slider_sides.value = sides;
    label_sides.innerText = 'Sides: ' + sides;
   }
   updateSliders();

   this.window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    size = canvas.width < canvas.height ? canvas.width * 0.2 : canvas.height * 0.2;
    ctx.shadowColor = 'rgba(0,0,0, 0.7)';
    //sombras direcciones y distorcion
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    drawFractal();
   })
});

