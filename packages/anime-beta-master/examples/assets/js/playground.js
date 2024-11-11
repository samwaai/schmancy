import { animate,createSpring, createDraggable } from '../../../lib/anime.esm.js';

const option1Button = document.getElementById('option1');
let forceRefresh = false;

option1Button.addEventListener('click', () => {
  option1Button.classList.toggle('active');
  forceRefresh = option1Button.classList.contains('active');
  const message = forceRefresh ? "Force Refresh: On" : "Force Refresh: Off";
  console.log(message);
});

const draggable = createDraggable('#drag-target', {
  x: false,
  container: '#drag-container',
  onRelease: (e) => {
    console.log('RELEASE');
    e.stop().animate.y(0, 500);
  },
  onDrag: () => {
    console.log('✊ DRAG');
  },
});