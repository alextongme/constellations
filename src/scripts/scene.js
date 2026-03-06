import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 0, 8);
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.minDistance = 2;
  controls.maxDistance = 20;

  // Moon
  const moonGeom = new THREE.SphereGeometry(0.4, 32, 32);
  const moonText = new THREE.TextureLoader().load(new URL('../images/moon.png', import.meta.url).href);
  moonText.wrapS = moonText.wrapT = THREE.MirroredRepeatWrapping;
  moonText.repeat.set(2, 2);
  const moon = new THREE.Mesh(moonGeom, new THREE.MeshBasicMaterial({ map: moonText }));
  scene.add(moon);

  // Blood moon (Mars-like)
  const bloodMoonGeom = new THREE.SphereGeometry(2, 32, 32);
  const bloodMoonText = new THREE.TextureLoader().load(new URL('../images/mars.jpg', import.meta.url).href);
  bloodMoonText.wrapS = bloodMoonText.wrapT = THREE.MirroredRepeatWrapping;
  bloodMoonText.repeat.set(1.3, 1);
  const bloodMoon = new THREE.Mesh(bloodMoonGeom, new THREE.MeshBasicMaterial({ map: bloodMoonText }));
  bloodMoon.position.set(9, -3, 8);
  scene.add(bloodMoon);

  // Wireframe blue planet
  const plutoGeom = new THREE.SphereGeometry(0.8, 12, 12);
  const pluto = new THREE.Mesh(plutoGeom, new THREE.MeshBasicMaterial({ color: 0x4466ff, wireframe: true }));
  pluto.position.set(-9, 3, -2);
  scene.add(pluto);

  // Stars
  const stars = [];
  for (let i = 0; i < 1000; i++) {
    const starGeom = new THREE.SphereGeometry(0.012, 6, 6);
    const star = new THREE.Mesh(starGeom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    star.position.set(randomSpread(), randomSpread(), randomSpread());
    stars.push(star);
    scene.add(star);
  }

  // Asteroids
  const asteroids = [];
  const asteroidText = new THREE.TextureLoader().load(new URL('../images/asteroid.jpeg', import.meta.url).href);
  asteroidText.wrapS = asteroidText.wrapT = THREE.MirroredRepeatWrapping;
  asteroidText.repeat.set(2, 2);

  for (let i = 0; i < 50; i++) {
    const size = Math.random() * 0.15;
    const geom = new THREE.DodecahedronGeometry(size, 1);
    const positions = geom.attributes.position;
    for (let j = 0; j < positions.count; j++) {
      positions.setX(j, positions.getX(j) + (Math.random() - 0.5) * (size / 4));
      positions.setY(j, positions.getY(j) + (Math.random() - 0.5) * (size / 4));
      positions.setZ(j, positions.getZ(j) + (Math.random() - 0.5) * (size / 4));
    }
    const asteroid = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ map: asteroidText }));
    asteroid.position.set(randomSpread(), randomSpread(), randomSpread());
    asteroids.push(asteroid);
    scene.add(asteroid);
  }

  // Coordinate display
  const coordDisplay = document.getElementById('coord-display');

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    moon.rotation.x -= 0.001;
    moon.rotation.y -= 0.001;

    bloodMoon.rotation.x -= 0.002;
    bloodMoon.rotation.z -= 0.002;

    pluto.rotation.y += 0.003;

    for (let i = 0; i < asteroids.length; i++) {
      const a = asteroids[i];
      if (i % 3 === 0) a.translateZ(0.003);
      else if (i % 4 === 0) a.translateY(0.002);
      else a.translateX(0.004);
    }

    controls.update();

    if (coordDisplay) {
      coordDisplay.textContent =
        `${camera.position.x.toFixed(2)} / ${camera.position.y.toFixed(2)} / ${camera.position.z.toFixed(2)}`;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function randomSpread() {
  const num = Math.floor(Math.random() * 10) + 1;
  return num * (Math.random() < 0.5 ? 1 : -1);
}
