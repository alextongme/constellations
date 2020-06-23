import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

// set size and location of canvas
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector(".about").append(renderer.domElement);

// make a moon
let moonGeom = new THREE.SphereGeometry(1, 30,30);
let moonText = new THREE.TextureLoader().load("src/images/moon.png");
moonText.wrapS = moonText.wrapT = THREE.MirroredRepeatWrapping;
moonText.repeat.set( 2, 2 );
let moonMate = new THREE.MeshBasicMaterial( { map: moonText } );
let moon = new THREE.Mesh(moonGeom, moonMate);

scene.add( moon );

// blood moon
let bloodMoonGeom = new THREE.SphereGeometry(0.5, 30,30);
let bloodMoonText = new THREE.TextureLoader().load("src/images/mars.jpg");
bloodMoonText.wrapS = bloodMoonText.wrapT = THREE.MirroredRepeatWrapping;
bloodMoonText.repeat.set( 1.3, 1 );
let bloodMoonMate = new THREE.MeshBasicMaterial( { map: bloodMoonText } );
let bloodMoon = new THREE.Mesh(bloodMoonGeom, bloodMoonMate);

bloodMoon.translateX(7);
bloodMoon.translateY(-3);
bloodMoon.translateZ(2);

scene.add( bloodMoon );

// make some stars
let stars = [];

function getRandom() {
  let num = Math.floor(Math.random()*10) + 1;
  num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  return num;
}

for (let i = 0; i < 300; i++) {
  let starGeom = new THREE.SphereGeometry(0.012, 10, 10);
  let starMate = new THREE.MeshBasicMaterial( { color: 0xffffff  } );
  let star = new THREE.Mesh(starGeom, starMate);
  star.position.set( getRandom(), getRandom(), getRandom() );
  // star.material.side = THREE.DoubleSide;
  stars.push( star );
}

//add in our stars
for (let j = 0; j < stars.length; j++) {
  scene.add( stars[j] );
}

// add some asteroids
let asteroids = [];

for (let i = 0; i < 10; i++) {
  let size = Math.random() * 0.15;
  let asteroidGeom = new THREE.DodecahedronGeometry(size,1);
  asteroidGeom.vertices.forEach(function(v){
    v.x += (0-Math.random()*(size/4));
    v.y += (0-Math.random()*(size/4));
    v.z += (0-Math.random()*(size/4));
  })

  let asteroidText = new THREE.TextureLoader().load("src/images/asteroid.jpeg");
  asteroidText.wrapS = asteroidText.wrapT = THREE.MirroredRepeatWrapping;
  asteroidText.repeat.set( 2, 2 );
  let asteroidMate = new THREE.MeshBasicMaterial( { map: asteroidText } );
  let asteroid = new THREE.Mesh(asteroidGeom, asteroidMate);

  asteroid.position.set( getRandom(), getRandom(), getRandom() );
  asteroids.push( asteroid );
}

for (let m = 0; m < asteroids.length; m++) {
  scene.add( asteroids[m] );
}

// set camera positions

let controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 0, 3 );

controls.update();
controls.enableZoom = false;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.6;

// star twinkling starting point
let lightness = 0;

// //
function updateCamera(event) {

  // camera.position.x += 0.1;
  // camera.position.y -= 0.05;
  if(event.deltaY > 0 ) {
    if(camera.position.x < 5) {
      camera.position.x += 0.05;
    }
  
    if(controls.target.x < 7) {
      controls.target.x += 0.08;
    }
    if(controls.target.y > -3) {
      controls.target.y -= 0.03;
    }
  
    if(controls.target.z < 2) {
      controls.target.z += 0.005;
    }
  } else {
   
      camera.position.x -= 0.05;
    
  
   
      controls.target.x -= 0.08;
    
    
      controls.target.y += 0.03;
    
  
  
      controls.target.z -= 0.005;
    
  }
  
}

window.addEventListener("wheel", updateCamera);

// animate our scene
function animate() {
  // moon rotation
  moon.rotation.x -= 0.001;
  moon.rotation.y -= 0.001;

  // bloodMoon rotation
  bloodMoon.rotation.x -= 0.005;
  // bloodMoon.rotation.y -= 0.005;
  bloodMoon.rotation.z -= 0.005;

  // star rotation and twinkling
  for (let k = 0; k < stars.length; k++) {
    let star = stars[k];
    star.rotation.x -= 0.01;
    star.rotation.y -= 0.01;
    lightness > 100 ? lightness = 0 : lightness += 0.4;
    star.material.color = new THREE.Color("hsl(0, 100%, " + lightness + "%)");
  }

  // asteroids movement
  for (let l = 0; l < asteroids.length; l++) {
    let asteroid = asteroids[l];
    asteroid.rotation.x -= 0.001;
    asteroid.rotation.y -= 0.001;

    if(l % 3 === 0) {
      asteroid.translateZ(0.008);
    } else if (l % 4 === 0) {
      asteroid.translateY(0.004);
    } else {
      asteroid.translateX(0.01);
    }
  }

  renderer.render( scene, camera );
  controls.update();
  requestAnimationFrame( animate );
}

animate();
