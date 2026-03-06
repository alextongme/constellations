import './styles/main.css';
import { createScene } from './scripts/scene.js';

const container = document.getElementById('scene-container');
createScene(container);

// Dismiss hero overlay
const dismissBtn = document.getElementById('hud-dismiss');
const hudCenter = document.getElementById('hud-center');
if (dismissBtn && hudCenter) {
  dismissBtn.addEventListener('click', () => {
    hudCenter.classList.add('hidden');
  });
}
