import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const modelPaths = {
  earthPlanet: new URL('../models/earth-planet.glb', import.meta.url).href,
  firePlanet: new URL('../models/fire-planet.glb', import.meta.url).href,
  asteroidMoon: new URL('../models/asteroid-moon.glb', import.meta.url).href,
  tieFighter: new URL('../models/tie-fighter.glb', import.meta.url).href,
  starDestroyer: new URL('../models/star-destroyer.glb', import.meta.url).href,
  reliant: new URL('../models/reliant.glb', import.meta.url).href,
  vulcan: new URL('../models/vulcan.glb', import.meta.url).href,
  whiteDwarf: new URL('../models/white-dwarf.glb', import.meta.url).href,
  halleysComet: new URL('../models/halleys-comet.glb', import.meta.url).href,
  callisto: new URL('../models/callisto.glb', import.meta.url).href,
  betelgeuse: new URL('../models/betelgeuse.glb', import.meta.url).href,
  tres2b: new URL('../models/tres-2b.glb', import.meta.url).href,
  luna: new URL('../models/luna.glb', import.meta.url).href,
  banzaiBill: new URL('../models/banzai-bill.glb', import.meta.url).href,
};

export function createScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting for GLB models
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(50, 100, 70);
  scene.add(dirLight);

  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 0, 8);
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.minDistance = 2;
  controls.maxDistance = 1000;

  // Small moon near origin (landmark)
  const moonGeom = new THREE.SphereGeometry(0.4, 32, 32);
  const moonText = new THREE.TextureLoader().load(new URL('../images/moon.png', import.meta.url).href);
  moonText.wrapS = moonText.wrapT = THREE.MirroredRepeatWrapping;
  moonText.repeat.set(2, 2);
  const moon = new THREE.Mesh(moonGeom, new THREE.MeshBasicMaterial({ map: moonText }));
  scene.add(moon);

  // Blood moon (Mars-like) — large planet
  const bloodMoonGeom = new THREE.SphereGeometry(30, 32, 32);
  const bloodMoonText = new THREE.TextureLoader().load(new URL('../images/mars.jpg', import.meta.url).href);
  bloodMoonText.wrapS = bloodMoonText.wrapT = THREE.MirroredRepeatWrapping;
  bloodMoonText.repeat.set(1.3, 1);
  const bloodMoon = new THREE.Mesh(bloodMoonGeom, new THREE.MeshBasicMaterial({ map: bloodMoonText }));
  bloodMoon.position.set(200, -80, 150);
  scene.add(bloodMoon);

  // Wireframe blue planet — large
  const plutoGeom = new THREE.SphereGeometry(20, 12, 12);
  const pluto = new THREE.Mesh(plutoGeom, new THREE.MeshBasicMaterial({ color: 0x4466ff, wireframe: true }));
  pluto.position.set(-250, 100, -150);
  scene.add(pluto);

  // Stars — 3 layers for depth illusion
  for (let i = 0; i < 2000; i++) {
    const starGeom = new THREE.SphereGeometry(0.03, 4, 4);
    const star = new THREE.Mesh(starGeom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    star.position.set(randomRange(150), randomRange(150), randomRange(150));
    scene.add(star);
  }
  for (let i = 0; i < 4000; i++) {
    const starGeom = new THREE.SphereGeometry(0.08, 4, 4);
    const star = new THREE.Mesh(starGeom, new THREE.MeshBasicMaterial({ color: 0xccccff }));
    star.position.set(randomRange(600), randomRange(600), randomRange(600));
    scene.add(star);
  }
  for (let i = 0; i < 6000; i++) {
    const starGeom = new THREE.SphereGeometry(0.2, 4, 4);
    const brightness = 0.5 + Math.random() * 0.5;
    const star = new THREE.Mesh(starGeom, new THREE.MeshBasicMaterial({
      color: new THREE.Color(brightness, brightness, brightness + 0.1),
    }));
    star.position.set(randomRange(3000), randomRange(3000), randomRange(3000));
    scene.add(star);
  }

  // Asteroids
  const asteroids = [];
  const asteroidText = new THREE.TextureLoader().load(new URL('../images/asteroid.jpeg', import.meta.url).href);
  asteroidText.wrapS = asteroidText.wrapT = THREE.MirroredRepeatWrapping;
  asteroidText.repeat.set(2, 2);

  for (let i = 0; i < 100; i++) {
    const size = Math.random() * 0.3 + 0.05;
    const geom = new THREE.DodecahedronGeometry(size, 1);
    const positions = geom.attributes.position;
    for (let j = 0; j < positions.count; j++) {
      positions.setX(j, positions.getX(j) + (Math.random() - 0.5) * (size / 4));
      positions.setY(j, positions.getY(j) + (Math.random() - 0.5) * (size / 4));
      positions.setZ(j, positions.getZ(j) + (Math.random() - 0.5) * (size / 4));
    }
    const asteroid = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ map: asteroidText }));
    asteroid.position.set(randomRange(200), randomRange(200), randomRange(200));
    asteroids.push(asteroid);
    scene.add(asteroid);
  }

  // GLB Models
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const glbModels = {};

  function loadModel(key, scale, pos) {
    loader.load(modelPaths[key], (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(scale);
      model.position.set(...pos);
      scene.add(model);
      glbModels[key] = model;
    });
  }

  // ---- PLANETS (~50-80 units) — huge, spread far apart ----
  // earthPlanet raw ~2/axis → scale 30 → ~60 units
  loadModel('earthPlanet',   30,     [-300,  80, -250]);
  // firePlanet raw ~2/axis → scale 25 → ~50 units
  loadModel('firePlanet',    25,     [ 350, -120, -300]);
  // tres2b raw ~1989/axis → scale 0.03 → ~60 units
  loadModel('tres2b',        0.03,   [-500, -150, -400]);
  // callisto raw ~423/axis → scale 0.1 → ~42 units
  loadModel('callisto',      0.1,    [ 150, -200, -600]);
  // luna raw ~1155/axis → scale 0.04 → ~46 units
  loadModel('luna',          0.04,   [ 100,  60,  200]);

  // ---- STARS (~100-150 units) — massive, very far away ----
  // betelgeuse raw ~45/axis → scale 3.3 → ~150 units
  loadModel('betelgeuse',    3.3,    [ 600, 250, -800]);
  // whiteDwarf raw ~45/axis → scale 2.2 → ~100 units
  loadModel('whiteDwarf',    2.2,    [-500, 200, -700]);

  // ---- MOONS/ASTEROIDS (~15-25 units) ----
  // asteroidMoon raw ~17/axis → scale 1.2 → ~20 units
  loadModel('asteroidMoon',  1.2,    [ 80,  60, -100]);

  // ---- SHIPS (~3-8 units) — tiny specks near you ----
  // tieFighter raw ~8/axis → scale 0.6 → ~5 units
  loadModel('tieFighter',    0.6,    [ -15,  -5,  -20]);
  // starDestroyer raw ~1590/axis → scale 0.005 → ~8 units
  loadModel('starDestroyer', 0.005,  [  30,  40, -100]);
  // reliant raw ~5.6/axis → scale 0.9 → ~5 units
  loadModel('reliant',       0.9,    [ -60,  15, -80]);
  // vulcan raw ~6.4/axis → scale 0.8 → ~5 units
  loadModel('vulcan',        0.8,    [  70, -20, -60]);

  // ---- FUN STUFF ----
  // halleysComet raw ~9.4/axis → scale 1 → ~10 units
  loadModel('halleysComet',  1,      [ 200,  30, -50]);
  // banzaiBill raw ~102/axis → scale 0.03 → ~3 units
  loadModel('banzaiBill',    0.03,   [ -25,  10, -30]);

  // Coordinate display
  const coordDisplay = document.getElementById('coord-display');

  // Arrow key / WASD flying
  const keys = {};
  const speedSlider = document.getElementById('speed-slider');
  let flySpeed = 0.2;
  if (speedSlider) speedSlider.addEventListener('input', (e) => { flySpeed = e.target.value / 100; });

  const flyKeys = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space']);
  window.addEventListener('keydown', (e) => { if (flyKeys.has(e.code)) e.preventDefault(); keys[e.code] = true; });
  window.addEventListener('keyup', (e) => { if (flyKeys.has(e.code)) e.preventDefault(); keys[e.code] = false; });

  function handleFlyControls() {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();

    if (keys['ArrowUp'] || keys['KeyW']) camera.position.addScaledVector(direction, flySpeed);
    if (keys['ArrowDown'] || keys['KeyS']) camera.position.addScaledVector(direction, -flySpeed);
    if (keys['ArrowLeft'] || keys['KeyA']) camera.position.addScaledVector(right, -flySpeed);
    if (keys['ArrowRight'] || keys['KeyD']) camera.position.addScaledVector(right, flySpeed);
    if (keys['Space']) camera.position.y += flySpeed;

    if (keys['ArrowUp'] || keys['KeyW']) controls.target.addScaledVector(direction, flySpeed);
    if (keys['ArrowDown'] || keys['KeyS']) controls.target.addScaledVector(direction, -flySpeed);
    if (keys['ArrowLeft'] || keys['KeyA']) controls.target.addScaledVector(right, -flySpeed);
    if (keys['ArrowRight'] || keys['KeyD']) controls.target.addScaledVector(right, flySpeed);
    if (keys['Space']) controls.target.y += flySpeed;
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    handleFlyControls();

    moon.rotation.x -= 0.001;
    moon.rotation.y -= 0.001;
    bloodMoon.rotation.x -= 0.0005;
    bloodMoon.rotation.z -= 0.0005;
    pluto.rotation.y += 0.001;

    // Planets rotate slowly
    if (glbModels.earthPlanet) glbModels.earthPlanet.rotation.y += 0.001;
    if (glbModels.firePlanet) glbModels.firePlanet.rotation.y += 0.0015;
    if (glbModels.tres2b) glbModels.tres2b.rotation.y += 0.001;
    if (glbModels.callisto) glbModels.callisto.rotation.y += 0.0008;
    if (glbModels.luna) glbModels.luna.rotation.y += 0.0006;
    if (glbModels.asteroidMoon) glbModels.asteroidMoon.rotation.y += 0.0005;

    // Stars rotate very slowly
    if (glbModels.betelgeuse) glbModels.betelgeuse.rotation.y += 0.0003;
    if (glbModels.whiteDwarf) glbModels.whiteDwarf.rotation.y += 0.0004;

    // Ships fly around
    const t = Date.now();
    if (glbModels.tieFighter) {
      glbModels.tieFighter.position.x += Math.sin(t * 0.001) * 0.015;
      glbModels.tieFighter.position.z += Math.cos(t * 0.001) * 0.015;
    }
    if (glbModels.starDestroyer) {
      glbModels.starDestroyer.position.x += Math.sin(t * 0.0002) * 0.005;
    }
    if (glbModels.reliant) {
      glbModels.reliant.position.x += Math.sin(t * 0.0003) * 0.01;
      glbModels.reliant.position.z += Math.cos(t * 0.0003) * 0.01;
    }
    if (glbModels.vulcan) {
      glbModels.vulcan.position.z += Math.sin(t * 0.0004) * 0.008;
    }

    // Halley's comet drifts slowly
    if (glbModels.halleysComet) {
      glbModels.halleysComet.position.x -= 0.005;
      glbModels.halleysComet.position.z -= 0.003;
    }

    // Banzai Bill flies forward
    if (glbModels.banzaiBill) {
      glbModels.banzaiBill.position.z -= 0.008;
      glbModels.banzaiBill.position.x += Math.sin(t * 0.0008) * 0.003;
    }

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

function randomRange(spread) {
  return (Math.random() - 0.5) * 2 * spread;
}
