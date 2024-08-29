import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Starfield, Earth, Sun, astros } from "./astros";
import { Ship, control } from "./ship";
import { Planet } from "./planet";
import {
  Scene,
  Clock,
  WebGLRenderer,
  PerspectiveCamera,
  LinearSRGBColorSpace,
  ACESFilmicToneMapping,
} from "three";
import "./style.scss";

const w = innerWidth;
const h = innerHeight;

const scene = new Scene();
const clock = new Clock();
const camera = new PerspectiveCamera(50, w / h, 0.1, 100);
const renderer = new WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 0.01;
controls.maxDistance = 0.2;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);

renderer.setSize(w, h);
renderer.setPixelRatio(devicePixelRatio);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputColorSpace = LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

const sun = new Sun().getSun();
scene.add(sun);

let ship: Ship;

const loader = new GLTFLoader();
loader.loadAsync("models/ship.glb").then((gltf) => {
  ship = new Ship(gltf, control);
  ship.setPosition(50, 5, 0);
  scene.add(ship.getShip());

  loader.loadAsync("models/missile.glb").then((gltf) => {
    ship.setMissile(gltf);
  });

  animate();
});

const earth = new Earth({
  orbitSpeed: 0.00029,
  orbitRadius: 16,
  orbitRotationDirection: "clockwise",
  planetSize: 0.5,
  planetAngle: (-23.4 * Math.PI) / 180,
  planetRotationSpeed: 0.01,
  planetRotationDirection: "counterclockwise",
  planetTexture: "/assets/earth-map-1.jpg",
}).getPlanet();
scene.add(earth);

const starfield = new Starfield().getStarfield();
scene.add(starfield);

astros.forEach((item) => {
  const planet = new Planet(item).getPlanet();
  scene.add(planet);
});

renderer.render(scene, camera);

addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

const animate = () => {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  ship.update(delta);

  controls.target = ship.position;

  controls.update(delta);

  renderer.render(scene, camera);
};
