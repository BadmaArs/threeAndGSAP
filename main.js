import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// GLTF Loader
let pokeball = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./assets/pokeball.glb", (gltf) => {
  pokeball = gltf.scene;

  pokeball.position.x = 1;
  pokeball.position.z = 0.5;
  pokeball.position.y = -1.2
  // pokeball.rotation.x = Math.PI * 0.2;
  // pokeball.rotation.z = Math.PI * 0.15;

  const radius = 0.5;
  pokeball.scale.set(radius, radius, radius);
  scene.add(pokeball);
});

// Scroll
const transformPokeball = [
  {
    scale: {x: 0.5, y: 0.5, z: 0.5},
    rotationY: 0,
    rotationZ: 0,
    positionX: 1,
    positionY: -1.2,
  },
  {
    scale: {x: 2, y: 2, z: 2},
    rotationY: 0,
    rotationZ: -0.15,
    positionX: -1.5,
    positionY: -5,
  },
  {
    scale: {x: 0.5, y: 0.5, z: 0.5},
    rotationY: 2 * Math.PI,
    rotationZ: 0.0314,
    positionX: 0,
    positionY: -1.2,
  },
];

let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
  console.log(newSection);

  if (newSection != currentSection) {
    currentSection = newSection;
    if (!!pokeball) {
      gsap.to(pokeball.rotation, {
        duration: 1.5,
        ease: "power2.inOut",
        y: transformPokeball[currentSection].rotationY,
        z: transformPokeball[currentSection].rotationZ,
      });
      gsap.to(pokeball.position, {
        duration: 1.5,
        ease: "power2.inOut",
        x: transformPokeball[currentSection].positionX,
        y: transformPokeball[currentSection].positionY,
      });
      gsap.to(pokeball.scale, { // Добавлено
        duration: 1.5,
        ease: "power2.inOut",
        ...transformPokeball[currentSection].scale,
      });
    }
  }
});

// On Reload
window.onbeforeunload = function () {
  window.screenTop(0, 0);
};

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);
// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

// Animate
const clock = new THREE.Clock();
let lastElapsetTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsetTime;
  lastElapsetTime = elapsedTime;

  console.log("tick");
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();