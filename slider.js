// =======================================================
// 🌌 3D Image Carousel with Scroll-Triggered Animation + Section Visibility Control
// =======================================================

import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// -------------------------------------------------------
// === Logo Intro Setup ===
// -------------------------------------------------------
const logoScreen = document.getElementById("logoScreen");
const canvas = document.querySelector("#draw");

// Hide 3D canvas initially
canvas.style.opacity = 0;

// Wait for 1s, then fade logo out and start 3D scene
setTimeout(() => {
  start3DScene();

  logoScreen.style.transition = "opacity 2s ease";
  logoScreen.style.opacity = "0";

  canvas.style.transition = "opacity 2s ease";
  canvas.style.opacity = "1";

  setTimeout(() => {
    logoScreen.style.display = "none";
  }, 2500);
}, 1000);

// -------------------------------------------------------
// === Start Three.js Scene ===
// -------------------------------------------------------
function start3DScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    200
  );
  camera.position.set(0, 0.01, 35);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // === Lights ===
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // === Carousel Setup ===
  const group = new THREE.Group();
  scene.add(group);

  const textureLoader = new THREE.TextureLoader();
  const images = [
    "./assets/images/slider-image-1.avif",
    "./assets/images/slider-image-2.avif",
    "./assets/images/slider-image-3.avif",
    "./assets/images/slider-image-4.avif",
    "./assets/images/slider-image-5.avif",
    "./assets/images/slider-image-6.avif",
    "./assets/images/slider-image-7.avif",
    "./assets/images/slider-image-8.avif",
  ];

  const radius = 12;
  const planeWidth = 5;
  const planeHeight = 4;
  group.position.y = -1;

  images.forEach((img, i) => {
    const texture = textureLoader.load(img);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const plane = new THREE.Mesh(geometry, material);

    const angle = (i / images.length) * Math.PI * 2;
    plane.position.x = Math.cos(angle) * radius;
    plane.position.z = Math.sin(angle) * radius;
    plane.lookAt(0, 0, 0);
    group.add(plane);
  });

  // -------------------------------------------------------
  // === Animation Setup ===
  // -------------------------------------------------------
  let baseRotationSpeed = 0.09;
  let targetTilt = 0;
  let rotationSpeed = 0;
  let currentTilt = 0;
  let floatOffset = 0;

  let startTime = Date.now();
  const moveDuration = 9000;
  const startZ = 10;
  const endZ = 1.5;
  const startScale = 0.3;
  const endScale = 2;

  // -------------------------------------------------------
  // 🌪️ Scroll Logic
  // -------------------------------------------------------
  let isZoomedOut = false;
  let isTransitioning = false;

  const zoomOutZ = 50;
  const zoomInZ = 35;
  const normalSpinSpeed = 0.09;
  const fastSpinSpeed = 1.5;
  const zoomDuration = 2000;

      group.rotation.y += baseRotationSpeed * 0.02;


  const bgImage = document.getElementById("bgImage");

  window.addEventListener("wheel", (event) => {

    if (isTransitioning) return;

    // ✅ Scroll Down → Animate to zoomed out fast state
    if (event.deltaY > 0 && !isZoomedOut) {
      isTransitioning = true;
      spinFast();
      fadeBackground("./assets/images/hero-2.avif");
      zoomCamera(zoomOutZ, () => {
        isZoomedOut = true;
        isTransitioning = false;
        window.dispatchEvent(new Event("heroAnimationComplete"));
      });
    }

    // ✅ Scroll Up → Return to normal state
    else if (event.deltaY < 0 && isZoomedOut) {
      isTransitioning = true;
      fadeBackground("./assets/images/hero-1.avif");
      zoomCamera(zoomInZ, () => {
        isZoomedOut = false;
        baseRotationSpeed = normalSpinSpeed;
        isTransitioning = false;
      });
    }
  });

  // -------------------------------------------------------
  // 💨 Fast Spin
  // -------------------------------------------------------
  function spinFast() {
    baseRotationSpeed = fastSpinSpeed;
    setTimeout(() => {
      if (!isZoomedOut) baseRotationSpeed = normalSpinSpeed;
    }, 2000);
  }

  // -------------------------------------------------------
  // 🌈 Fade Background
  // -------------------------------------------------------
  function fadeBackground(newSrc) {
    if (!bgImage) return;
    bgImage.style.transition = "opacity 1.5s ease";
    bgImage.style.opacity = "0";
    setTimeout(() => {
      bgImage.src = newSrc;
      bgImage.style.opacity = "1";
    }, 800);
  }

  // -------------------------------------------------------
  // 🎥 Zoom Animation
  // -------------------------------------------------------
  function zoomCamera(targetZ, onComplete) {
    const startZ = camera.position.z;
    const startTime = Date.now();

    function animateZoom() {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / zoomDuration, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      camera.position.z = THREE.MathUtils.lerp(startZ, targetZ, ease);
      renderer.render(scene, camera);
      if (t < 1) requestAnimationFrame(animateZoom);
      else if (onComplete) onComplete();
    }
    animateZoom();
  }

  // -------------------------------------------------------
  // 👀 Hide Circle When Reaching 2nd Section
  // -------------------------------------------------------

  // 👀 Handle circle fade + section cross-fade with black gradient
  const secondSection = document.getElementById("secondSection");
  const transitionOverlay = document.getElementById("transitionOverlay");

  window.addEventListener("scroll", () => {
    if (!secondSection || !transitionOverlay) return;
    const rect = secondSection.getBoundingClientRect();

    // ✅ When starting to reach 2nd section
    if (rect.top < window.innerHeight * 0.8) {
      // Fade out hero circle
      canvas.style.transition = "opacity 1s ease";
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.visibility = "hidden";

      // Show black gradient for ~1s
      transitionOverlay.style.opacity = "1";

      // After 1s → hide gradient + reveal 2nd section
      setTimeout(() => {
        transitionOverlay.style.opacity = "0";
        secondSection.style.transition = "opacity 1s ease";
        secondSection.style.opacity = "1";
      }, 1000);
    } else {
      // Scroll back up → fade 2nd section out, fade hero circle back in
      secondSection.style.transition = "opacity 1s ease";
      secondSection.style.opacity = "0";

      transitionOverlay.style.opacity = "1";
      setTimeout(() => {
        transitionOverlay.style.opacity = "0";
        canvas.style.transition = "opacity 1s ease";
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "auto";
        canvas.style.visibility = "visible";
      }, 1000);
    }
  });

  // -------------------------------------------------------
  // 🌀 Animation Loop
  // -------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);

    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / moveDuration, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.z = THREE.MathUtils.lerp(startZ, endZ, ease);
    const scale = THREE.MathUtils.lerp(startScale, endScale, ease);
    group.scale.set(scale, scale, scale);

    group.rotation.y += baseRotationSpeed * 0.02;

    currentTilt += (targetTilt - currentTilt) * 0.1;
    const bowTilt = THREE.MathUtils.lerp(0.9, 0, ease);
    group.rotation.x = currentTilt + bowTilt;

    floatOffset += 0.015 + baseRotationSpeed * 0.5;
    group.position.y = -1 + Math.sin(floatOffset) * 0.1;

    renderer.render(scene, camera);

    // 🪶 Fade overlay based on distance
    const overlay = document.getElementById("textOverlay");
    overlay.style.opacity = camera.position.z < 4 ? "1" : "0";
  }

  animate();

  // Handle Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
