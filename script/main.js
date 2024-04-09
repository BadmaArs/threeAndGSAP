import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { transformPokeball } from "./transform";
import gsap from "gsap";

// Инициализация и создание сцены и 3д модели
const canvas = document.querySelector("canvas.webgl");
// const helper = new THREE.AxesHelper()
// scene.add(helper)
const modelThree = "../t34.glb";
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
let py = -4.7;
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
gltfLoader.load(
  modelThree,
  (gltf) => {
    pokeball = gltf.scene;

    pokeball.rotation.y = py;
    pokeball.rotation.z = 0;
    pokeball.position.x = -0.7;
    pokeball.position.y = -0.1;
    pokeball.position.z = 2;
    if (sizes.width < 600) {
      py = -5.1;
      pokeball.rotation.y = py;
    } else {
      py = -4.7;
    }
    const radius = 0.5;
    pokeball.scale.set(radius, radius, radius);
    scene.add(pokeball);
  },
  (xhr) => {
    // Этот код будет выполнен
    // в процессе загрузки
    const totalSized = 31062868;
    console.log(xhr.loaded, xhr.total, xhr.loaded / totalSized);
    let preload = (xhr.loaded / totalSized) * 100 + "";
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
    if (preloadSplit[0] == "100") {
      loaderDiv.classList.add("noActive");
    }
  },
  (error) => {
    // Этот код будет выполнен при возникновении ошибки
    console.error(error);
  }
);
// Camera
// Настройка камеры для десктопа и мобильных устройств
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
if (sizes.width < 600) {
  camera.position.z = 10;
  camera.position.y = 1.2;
  camera.position.x = -0.7;
  camera.rotation.x = -0.31;
  camera.rotation.y = 0;
} else {
  camera.position.z = 5;
  camera.position.y = 0.5;
}
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
// Scroll
// Координаты для секций

// Анимация и формула нахождения секции
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
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

// Light
// Настройка света
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

// Animate
const clock = new THREE.Clock();
let lastElapsetTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsetTime;
  lastElapsetTime = elapsedTime;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
