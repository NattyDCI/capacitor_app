import p5 from 'p5';

new p5((p) => {
  let timer = 10;
  let running = false;
  let lastTime = 0;

  p.setup = () => {
    const cnv = p.createCanvas(400, 400, p.WEBGL);
    cnv.parent('p5-container');

    const btn = document.getElementById('startBtn');

    btn.addEventListener('click', () => {
      running = !running;
      lastTime = p.millis();
      btn.innerText = running ? 'Pause' : 'Start';
    });
  };

  p.draw = () => {
    p.background(18);

    if (running && p.millis() - lastTime >= 1000 && timer > 0) {
      timer--;
      lastTime = p.millis();
    }

    p.rotateX(-Math.PI / 6);
    p.rotateY(p.millis() * 0.001);
    p.box(100);

    p.resetMatrix();
    p.fill(255);
    p.textSize(64);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(timer, 0, 120);
  };
});