import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import gsap from "gsap";

// Инициализация и создание сцены и 3д модели
const canvas = document.querySelector("canvas.webgl");
// const helper = new THREE.AxesHelper()
// scene.add(helper)
const modelThree = "./t34.glb";
// Scene
const scene = new THREE.Scene();
// Sizes
// Размеры камеры
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", function () {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
});
console.log(sizes.height, sizes.width);

// GLTF Loader
let pokeball = null;
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
gltfLoader.load(
  modelThree,
  (gltf) => {
    pokeball = gltf.scene;

    pokeball.rotation.y = -4.7;
    pokeball.rotation.z = 0;
    pokeball.position.x = -0.7;
    pokeball.position.y = -0.1;
    pokeball.position.z = 2;
    if (sizes.width < 600) {
      pokeball.rotation.y = -5.1;
    }
    const radius = 0.5;
    pokeball.scale.set(radius, radius, radius);
    scene.add(pokeball);
  },
  (xhr) => {
    // Этот код будет выполнен в процессе загрузки
    let preload = (xhr.loaded / xhr.total) * 100 + "";
    let preloadSplit = preload.split(".");
    const loaderDiv = document.querySelector(".loader");
    loaderDiv.innerHTML = `
    <div class="lineLoader">
      <div class="inLineLoader" style="width: ${preloadSplit[0]}%"></div>
    </div>
    <h3>
      Пожалуйста подождите <br />
      Идет загрузка <br />
      ${preloadSplit[0]}%
    </h3>
    `;
    if(preloadSplit[0] == '100'){
      loaderDiv.classList.add('noActive')
    }
  },
  (error) => {
    // Этот код будет выполнен при возникновении ошибки
    console.error(error);
  }
);

// Scroll
// Координаты для секций
const transformPokeball = [
  {
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotationY: -4.7,
    rotationZ: 0,
    positionX: -0.7,
    positionY: -0.1,
  },
  {
    scale: { x: 0.7, y: 0.7, z: 0.7 },
    rotationY: -4.5,
    rotationZ: 0,
    positionX: 0.4,
    positionY: -0.1,
  },
  {
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotationY: -2,
    rotationZ: 0,
    positionX: -0.5,
    positionY: -0.1,
  },
  {
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotationY: (55 * Math.PI) / 180,
    rotationZ: 0,
    positionX: 0.6,
    positionY: 0,
  },
  {
    scale: { x: 0.7, y: 0.7, z: 0.7 },
    rotationY: -4,
    rotationZ: 0,
    positionX: -0.8,
    positionY: -0.4,
  },
  {
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotationY: -5.7,
    rotationZ: 0,
    positionX: 0.6,
    positionY: -0.1,
  },
];
// Анимация и формула нахождения секции
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
  // console.log(newSection);

  if (newSection != currentSection) {
    currentSection = newSection;
    if (!!pokeball) {
      gsap.to(pokeball.rotation, {
        duration: 4.5,
        ease: "power2.inOut",
        y: transformPokeball[currentSection].rotationY,
        z: transformPokeball[currentSection].rotationZ,
        onUpdate: function () {
          // добавил эту строку
          if (sizes.width < 600) {
            camera.lookAt(pokeball.position); // и эту строку
          }
        },
      });
      gsap.to(pokeball.position, {
        duration: 4.5,
        ease: "power2.inOut",
        x: transformPokeball[currentSection].positionX,
        y: transformPokeball[currentSection].positionY,
      });
      gsap.to(pokeball.scale, {
        // Добавлено
        duration: 4.5,
        ease: "power2.inOut",
        ...transformPokeball[currentSection].scale,
      });
    }
  }
});

// Camera
// Настройка камеры для десктопа и мобильных устройств
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
if (sizes.width < 600) {
  camera.position.z = 7;
  camera.position.y = 1;
  camera.position.x = -0.7;
  camera.rotation.x = -0.3;
  camera.rotation.y = 0;
} else {
  camera.position.z = 5;
  camera.position.y = 0.5;
}
scene.add(camera);

// Light
// Настройка света
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

  // console.log("tick");
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
