const controls = {
  tipo: document.querySelector('#tipoGc'),
  titulo: document.querySelector('#titulo'),
  subtitulo: document.querySelector('#subtitulo'),
  largura: document.querySelector('#largura'),
  relogio: document.querySelector('#mostrarRelogio'),
  fundo: document.querySelector('#fundo'),
  animacao: document.querySelector('#animacao'),
  mostrarBtn: document.querySelector('#mostrar'),
  ocultarBtn: document.querySelector('#ocultar')
};

const gcWrapper = document.querySelector('#gcWrapper');
const gc = document.querySelector('#gc');
const gcTitulo = document.querySelector('#gcTitulo');
const gcSubtitulo = document.querySelector('#gcSubtitulo');
const relogio = document.querySelector('#relogio');

let clockInterval;
let currentAnimation = '';

function startClock() {
  stopClock();
  const update = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    relogio.textContent = `${hh}:${mm}:${ss}`;
  };
  update();
  clockInterval = setInterval(update, 1000);
}

function stopClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
}

function applyTheme(tipo) {
  gc.classList.remove('gc--jornal', 'gc--entretenimento', 'gc--esporte');
  switch (tipo) {
    case 'entretenimento':
      gc.classList.add('gc--entretenimento');
      break;
    case 'esporte':
      gc.classList.add('gc--esporte');
      break;
    default:
      gc.classList.add('gc--jornal');
  }
}

function applyBackground(fundo) {
  const classes = ['gc--fundo-verde', 'gc--fundo-azul', 'gc--fundo-transparente'];
  [gcWrapper, gc].forEach(el => el.classList.remove(...classes));
  let toAdd = 'gc--fundo-transparente';
  if (fundo === 'verde') toAdd = 'gc--fundo-verde';
  if (fundo === 'azul') toAdd = 'gc--fundo-azul';
  [gcWrapper, gc].forEach(el => el.classList.add(toAdd));
}

function applyAnimation(tipo) {
  const animations = ['animate-slide', 'animate-fade', 'animate-zoom'];
  gc.classList.remove(...animations);
  currentAnimation = '';
  const map = {
    slide: 'animate-slide',
    fade: 'animate-fade',
    zoom: 'animate-zoom'
  };
  currentAnimation = map[tipo] || 'animate-slide';
}

function toggleClock(show) {
  relogio.style.display = show ? 'block' : 'none';
  if (show) {
    startClock();
  } else {
    stopClock();
  }
}

function setWidth(px) {
  const width = Math.min(Math.max(Number(px) || 0, 320), 1600);
  gc.style.width = `${width}px`;
}

function compressText(element, containerWidth) {
  if (!element) return;
  element.style.transform = 'scaleX(1)';
  element.style.fontSize = '';

  const scrollWidth = element.scrollWidth;
  if (scrollWidth <= containerWidth) return;

  const ratio = containerWidth / scrollWidth;
  const minScale = 0.55;
  const scale = Math.max(ratio, minScale);

  // Reduce font size slightly when compression is needed for legibility
  if (ratio < 0.95) {
    const baseSize = parseFloat(getComputedStyle(element).fontSize);
    const newSize = Math.max(12, baseSize * Math.min(1, ratio + 0.1));
    element.style.fontSize = `${newSize}px`;
  }

  element.style.transform = `scaleX(${scale})`;
}

function updateText() {
  gcTitulo.textContent = controls.titulo.value || 'Título do GC';
  gcSubtitulo.textContent = controls.subtitulo.value || 'Subtítulo ou linha auxiliar';
  requestAnimationFrame(() => {
    const available = gc.clientWidth - (relogio.offsetWidth || 0) - 32;
    compressText(gcTitulo, available);
    compressText(gcSubtitulo, available);
  });
}

function showGc() {
  gc.classList.add('gc--visible');
  gc.classList.remove('leave');
  if (currentAnimation) {
    gc.classList.remove('animate-slide', 'animate-fade', 'animate-zoom');
    void gc.offsetWidth; // restart animation
    gc.classList.add(currentAnimation);
  }
}

function hideGc() {
  if (!gc.classList.contains('gc--visible')) return;
  if (currentAnimation) {
    gc.classList.add('leave');
    gc.addEventListener(
      'animationend',
      () => {
        gc.classList.remove('gc--visible', 'leave');
      },
      { once: true }
    );
  } else {
    gc.classList.remove('gc--visible');
  }
}

function bindEvents() {
  controls.tipo.addEventListener('input', () => applyTheme(controls.tipo.value));
  controls.fundo.addEventListener('input', () => applyBackground(controls.fundo.value));
  controls.animacao.addEventListener('input', () => applyAnimation(controls.animacao.value));
  controls.mostrarBtn.addEventListener('click', showGc);
  controls.ocultarBtn.addEventListener('click', hideGc);
  controls.relogio.addEventListener('change', () => toggleClock(controls.relogio.checked));

  ['input', 'change'].forEach(evt => {
    controls.titulo.addEventListener(evt, updateText);
    controls.subtitulo.addEventListener(evt, updateText);
    controls.largura.addEventListener(evt, () => {
      setWidth(controls.largura.value);
      updateText();
    });
  });
}

function init() {
  applyTheme(controls.tipo.value);
  applyBackground(controls.fundo.value);
  applyAnimation(controls.animacao.value);
  toggleClock(controls.relogio.checked);
  setWidth(controls.largura.value);
  updateText();
  bindEvents();
  showGc();
}

init();
