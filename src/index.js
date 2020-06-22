import "./styles/reset.css";
import "./styles/index.css";
import * as THREE from 'three';
import canvasExample from "./scripts/canvas";

window.addEventListener("DOMContentLoaded", main);

function main() {

// three implementation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// lets add a cube in
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

// render our cube
function animate() {
  requestAnimationFrame( animate );
  cube.rotation.x += 0.01;
cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}
animate();

// old code
  // const canvas = new canvasExample();
  // canvas.createCanvas();

  // let animating = true;

  // const animation = () => {
  //   canvas.clearSquare();
  //   if (animating) canvas.updateSquare();
  //   canvas.drawSquare();
  //   window.requestAnimationFrame(animation);
  //   if (canvas.coords[0] + canvas.coords[2] > canvas.canvas.width)
  //     canvas.reverseAnimation();
  //   if (canvas.coords[0] < 0) canvas.reverseAnimation();
  // };

  // window.requestAnimationFrame(animation);

  // window.addEventListener("keydown", (event) => {
  //   if (event.which === 32) {
  //     event.preventDefault();
  //     canvas.reverseAnimation();
  //     canvas.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  //   }
  // });

  // window.addEventListener("mousedown", (event) => {
  //   event.preventDefault();
  //   console.log("click");
  //   animating = !animating;
  // });


}
