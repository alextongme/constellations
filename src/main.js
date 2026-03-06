import './styles/main.css';
import { createScene } from './scripts/scene.js';

const container = document.getElementById('scene-container');
createScene(container);

// Toggle hero overlay
const dismissBtn = document.getElementById('hud-dismiss');
const showBtn = document.getElementById('hud-show');
const hudCenter = document.getElementById('hud-center');

if (dismissBtn && showBtn && hudCenter) {
  dismissBtn.addEventListener('click', () => {
    hudCenter.classList.add('hidden');
    showBtn.style.display = 'flex';
  });
  showBtn.addEventListener('click', () => {
    hudCenter.classList.remove('hidden');
    showBtn.style.display = 'none';
  });
}
