import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const videoButton = document.querySelector(".video-button");
const audioButton = document.querySelector(".audio-button");

// Init the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#f5f5f5");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const color = 0xffffff;
const intensity = 1.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);
light.position.set(0, 3, 0);

camera.position.z = 1;
camera.position.y = 0;
controls.update();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
animate();

// Create a TV mesh
const video = document.createElement("video");
video.src = "./video.mp4";
video.loop = true;
video.playsInline = true;

const texture = new THREE.VideoTexture(video);
texture.colorSpace = THREE.SRGBColorSpace;
const videoMaterial = new THREE.MeshStandardMaterial({
  map: texture,
  visible: false,
});

const geometry = new THREE.PlaneGeometry(1.6, 0.9);
const plane = new THREE.Mesh(geometry, videoMaterial);
texture.update();
scene.add(plane);

const frame = new THREE.Mesh(
  new THREE.BoxGeometry(1.7, 1, 0.2),
  new THREE.MeshStandardMaterial({ color: "#212121" })
);
frame.position.set(0, 0, -0.11);
scene.add(frame);

// Init audio
const audio = new Audio("./audio.wav");
audio.volume = 0.1;

audio.addEventListener("ended", () => {
  video.muted = false;
  if (audioButton) {
    audioButton.innerHTML = "Включить";
    audioButton.classList.remove("active");
  }
});

// Aplly resize listener
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

// Button basic functionality
document.querySelectorAll("button").forEach((button) =>
  button.addEventListener("click", () => {
    if (button.innerHTML === "Включить") {
      button.innerHTML = "Выключить";
      button.classList.add("active");
    } else {
      button.innerHTML = "Включить";
      button.classList.remove("active");
    }
  })
);

// Button specific functionality
videoButton?.addEventListener("click", () => {
  if (videoButton?.classList.contains("active")) {
    enableVideo();
  } else {
    disableVideo();
  }

  muteVideoIfNeeded();
});

audioButton?.addEventListener("click", () => {
  if (audioButton?.classList.contains("active")) {
    enableAudio();
  } else {
    disableAudio();
  }

  muteVideoIfNeeded();
});

function enableVideo() {
  video.play();
  videoMaterial.visible = true;
}
function disableVideo() {
  video.pause();
  videoMaterial.visible = false;
}

function enableAudio() {
  audio.play();
}
function disableAudio() {
  audio.pause();
}

function muteVideoIfNeeded() {
  if (audioButton?.classList.contains("active")) {
    video.muted = true;
  } else {
    video.muted = false;
  }
}
