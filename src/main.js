import './style.css';
import './sketch.js'; // Al importar, se ejecuta la instancia

console.log('App iniciada');

document.querySelector('#app').innerHTML = `
  <h1>Pomodoro App</h1>
  <button>Start</button>`
  