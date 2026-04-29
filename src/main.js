// Librerías y archivos que uso en la app
import p5 from "p5";
import { Haptics } from "@capacitor/haptics";
import soundUrl from "./assets/cheers_finished_sound.mp3";
import soundUrlRow from "./assets/counter_addordelete.mp3";
import soundUrlReset from "./assets/reset_swoosh.mp3";
import "./style.css";

// Imágenes que se asignan según el tipo de proyecto
import shawlImg from "./assets/images/shawl.jpg";
import scarfImg from "./assets/images/scarf.jpg";
import sweaterImg from "./assets/images/sweater.jpg";
import socksImg from "./assets/images/socks.jpg";
import defaultYarnImg from "./assets/images/default_yarn.jpg";
import runningGif from "./assets/images/running_sheep.gif";

const imageLibrary = {
  shawl: shawlImg,
  scarf: scarfImg,
  sweater: sweaterImg,
  socks: socksImg,
  default: defaultYarnImg,
};

// Variables principales del estado de la app
let projects = [];
let currentProjectId = null;
let timerInterval = null;
let timerRunning = false;
let lastTimerUpdate = null;

const STORAGE_KEY = "knitTrackProjects";

// Elige una imagen dependiendo del nombre del proyecto
function getProjectImage(projectName) {
  const name = projectName.toLowerCase();

  if (name.includes("shawl")) return imageLibrary.shawl;
  if (name.includes("scarf")) return imageLibrary.scarf;
  if (name.includes("sweater")) return imageLibrary.sweater;
  if (name.includes("socks")) return imageLibrary.socks;

  return imageLibrary.default;
}

// Guarda los proyectos en el navegador
function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// Carga los proyectos guardados cuando se abre la app
function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);
  projects = saved ? JSON.parse(saved) : [];
}

// Busca el proyecto que está abierto actualmente
function getCurrentProject() {
  return projects.find((project) => project.id === currentProjectId);
}

// Cambia entre pantallas ocultando las demás
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

// Activa vibración cuando hay una interacción importante
async function triggerHaptic() {
  try {
    await Haptics.vibrate({ duration: 500 });
    console.log("Vibration triggered");
  } catch (error) {
    console.log("Haptics error:", error);
  }
}

// Función general para reproducir sonidos
function playSound(url) {
  const audio = new Audio(url);
  audio.currentTime = 0;
  audio.volume = 1;

  audio.play().catch((error) => {
    console.log("Sound failed:", error);
  });
}

function playMilestoneSound() {
  playSound(soundUrl);
}

function playResetSound() {
  playSound(soundUrlReset);
}

function playRowCounterSound() {
  playSound(soundUrlRow);
}

// Convierte segundos a formato 00:00:00
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Calcula el porcentaje de milestones completados
function calculateProgress(project) {
  if (project.milestones.length === 0) return 0;

  const completed = project.milestones.filter((m) => m.done).length;
  return Math.round((completed / project.milestones.length) * 100);
}

// Dibuja las tarjetas de proyectos en la pantalla principal
function renderHome() {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <button class="delete-project-btn" aria-label="Delete project">×</button>
      <img src="${project.image}" alt="${project.name}" class="project-image" />
      
      <div class="card-content">
        <p class="project-name">${project.name}</p>
        <div class="stats-line">
          <p class="status-title">Status</p>
          <div class="progress-pill">${calculateProgress(project)}%</div>
        </div>
      </div>
    `;

    // Al hacer click en una tarjeta, se abre ese proyecto
    card.addEventListener("click", () => {
      currentProjectId = project.id;
      renderProject();
      showScreen("projectScreen");
    });

    const deleteBtn = card.querySelector(".delete-project-btn");

    // Borra un proyecto sin abrir la tarjeta
    deleteBtn.addEventListener("click", async (event) => {
      event.stopPropagation();

      playResetSound();
      await triggerHaptic();

      projects = projects.filter((p) => p.id !== project.id);

      if (currentProjectId === project.id) {
        currentProjectId = null;
        stopTimer();
      }

      saveProjects();
      renderHome();
    });

    grid.appendChild(card);
  });
}

// Actualiza toda la información visible de un proyecto
function renderProject() {
  const project = getCurrentProject();
  if (!project) return;

  const formattedTime = formatTime(project.timeSpent);

  document.getElementById("projectTitle").textContent = project.name;
  document.getElementById("rowCount").textContent = project.rows;
  document.getElementById("progressText").textContent =
    `${calculateProgress(project)}% project complete`;
  document.getElementById("timeInvestedText").textContent = formattedTime;
  document.getElementById("modalTimerText").textContent = formattedTime;

  const projectImage = document.getElementById("projectImage");
  projectImage.innerHTML = `
    <img src="${project.image}" alt="${project.name}" class="project-detail-image" />
  `;

  const list = document.getElementById("milestonesList");
  list.innerHTML = "";

  // Crea la lista de milestones del proyecto
  project.milestones.forEach((milestone, index) => {
    const li = document.createElement("li");
    li.className = milestone.done ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = milestone.done;

    // Marca un milestone como completado
    checkbox.addEventListener("change", async () => {
      milestone.done = checkbox.checked;
      saveProjects();
      renderProject();

      if (milestone.done) {
        await triggerHaptic();
        playMilestoneSound();
        showScreen("celebrationScreen");
      }
    });

    const text = document.createElement("span");
    text.textContent = milestone.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";

    // Elimina un milestone de la lista
    deleteBtn.addEventListener("click", () => {
      playResetSound();
      project.milestones.splice(index, 1);
      saveProjects();
      renderProject();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// Cambia entre el texto del timer y la animación cuando el timer está activo
function updateTimerAnimation() {
  const image = document.getElementById("timerRunningImage");
  const idleText = document.getElementById("timerIdleText");

  if (!image || !idleText) return;

  image.src = runningGif;

  image.classList.toggle("hidden", !timerRunning);
  idleText.classList.toggle("hidden", timerRunning);
}

// Cambia el texto del botón entre Start y Pause
function updateTimerButton() {
  document.getElementById("modalStartTimerBtn").textContent = timerRunning
    ? "Pause"
    : "Start";

  updateTimerAnimation();
}

// Para el timer y limpia el intervalo
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  lastTimerUpdate = null;

  updateTimerButton();
}

// Inicia el timer y va sumando segundos al proyecto actual
function startTimer() {
  const project = getCurrentProject();
  if (!project) return;

  clearInterval(timerInterval);

  timerRunning = true;
  lastTimerUpdate = Date.now();
  updateTimerButton();

  timerInterval = setInterval(() => {
    const currentProject = getCurrentProject();
    if (!currentProject) return;

    const now = Date.now();
    const diff = Math.floor((now - lastTimerUpdate) / 1000);

    if (diff > 0) {
      currentProject.timeSpent += diff;
      lastTimerUpdate = now;

      saveProjects();

      document.getElementById("modalTimerText").textContent = formatTime(
        currentProject.timeSpent,
      );

      document.getElementById("timeInvestedText").textContent = formatTime(
        currentProject.timeSpent,
      );
    }
  }, 1000);
}

// Aquí conecto todos los botones del HTML con sus acciones
function setupUI() {
  document.getElementById("showNewProjectBtn").addEventListener("click", () => {
    showScreen("newProjectScreen");
  });

  document
    .getElementById("cancelNewProjectBtn")
    .addEventListener("click", () => {
      showScreen("homeScreen");
    });

  // Crea un proyecto nuevo
  document.getElementById("createProjectBtn").addEventListener("click", () => {
    const input = document.getElementById("projectNameInput");
    const name = input.value.trim();

    if (!name) return;

    playRowCounterSound();

    const newProject = {
      id: crypto.randomUUID(),
      name,
      image: getProjectImage(name),
      rows: 0,
      timeSpent: 0,
      milestones: [],
    };

    projects.push(newProject);
    saveProjects();

    input.value = "";
    renderHome();
    showScreen("homeScreen");
  });

  document.getElementById("backHomeBtn").addEventListener("click", () => {
    stopTimer();
    saveProjects();
    renderHome();
    showScreen("homeScreen");
  });

  // Suma una fila al contador
  document
    .getElementById("increaseRowBtn")
    .addEventListener("click", async () => {
      const project = getCurrentProject();
      if (!project) return;

      project.rows += 1;

      playRowCounterSound();
      await triggerHaptic();

      saveProjects();
      renderProject();
    });

  // Resta una fila, pero nunca deja que baje de 0
  document
    .getElementById("decreaseRowBtn")
    .addEventListener("click", async () => {
      const project = getCurrentProject();
      if (!project) return;

      project.rows = Math.max(0, project.rows - 1);

      playRowCounterSound();
      await triggerHaptic();

      saveProjects();
      renderProject();
    });

  // Añade un milestone al proyecto actual
  document.getElementById("addMilestoneBtn").addEventListener("click", () => {
    const project = getCurrentProject();
    const input = document.getElementById("milestoneInput");
    const text = input.value.trim();

    if (!project || !text) return;

    playRowCounterSound();

    project.milestones.push({
      text,
      done: false,
    });

    input.value = "";
    saveProjects();
    renderProject();
  });

  document.getElementById("openTimerModalBtn").addEventListener("click", () => {
    document.getElementById("timerModal").classList.remove("hidden");
    updateTimerAnimation();
  });

  document
    .getElementById("modalCloseTimerBtn")
    .addEventListener("click", () => {
      document.getElementById("timerModal").classList.add("hidden");
    });

  // Start/Pause del timer
  document
    .getElementById("modalStartTimerBtn")
    .addEventListener("click", () => {
      playRowCounterSound();

      if (timerRunning) {
        stopTimer();
      } else {
        startTimer();
      }
    });

  // Reinicia el tiempo del proyecto
  document
    .getElementById("modalResetTimerBtn")
    .addEventListener("click", () => {
      const project = getCurrentProject();
      if (!project) return;

      playResetSound();

      project.timeSpent = 0;
      stopTimer();

      saveProjects();
      renderProject();
    });

  document
    .getElementById("closeCelebrationBtn")
    .addEventListener("click", () => {
      renderProject();
      showScreen("projectScreen");
    });
}

// Al iniciar la app, cargo datos guardados y preparo la interfaz
loadProjects();
setupUI();
renderHome();

// Animación de celebración con p5 cuando se completa un milestone
new p5((p) => {
  let particles = [];

  p.setup = () => {
    const cnv = p.createCanvas(320, 320);
    cnv.parent("p5-container");

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(-200, 0),
        speed: p.random(1, 4),
        size: p.random(5, 12),
      });
    }
  };

  p.draw = () => {
    p.background(250, 240, 230);

    particles.forEach((particle) => {
      p.rect(particle.x, particle.y, particle.size, particle.size);
      particle.y += particle.speed;

      if (particle.y > p.height) {
        particle.y = p.random(-100, 0);
        particle.x = p.random(p.width);
      }
    });
  };
});