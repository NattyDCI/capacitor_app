

// No importamos p5 aquí, usamos la variable global 'p5' cargada en el HTML
//Aquí definimos la lógica visual del Pomodoro:
import p5 from "p5";

export const sketch = new p5((p) => {  

  p.setup = () => {
    const cnv = p.createCanvas(400, 400);
    cnv.parent('p5-container'); // Anclar al div del HTML
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(255);
  };

  p.draw = () => {
    p.background(0);
    // Aquí iría la lógica del temporizador visual
    p.text('Pomodoro', p.width / 2, p.height / 2);
  };

});