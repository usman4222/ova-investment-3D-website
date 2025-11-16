// =======================================================
// 🌌 3D Image Carousel with Scroll-Triggered Animation + Typewriter
// =======================================================

import * as THREE from "three";

/**
 * Main initialization function - called by dynamic loader
 */
export function initSection() {
  const logoScreen = document.getElementById("logoScreen");
  const canvas = document.querySelector("#draw");

  // Guard against missing elements
  if (!logoScreen || !canvas) {
    console.error("❌ Hero elements missing");
    return;
  }

  // Hide 3D canvas initially
  canvas.style.opacity = "0";

  // ✅ START TYPEWRITER IMMEDIATELY (even before logo fades)
  initTypewriter();

  // Wait for 1s, then fade logo out and start 3D scene
  setTimeout(() => {
    start3DScene(canvas, logoScreen);

    logoScreen.style.transition = "opacity 2s ease";
    logoScreen.style.opacity = "0";

    canvas.style.transition = "opacity 2s ease";
    canvas.style.opacity = "1";

    setTimeout(() => {
      logoScreen.style.display = "none";
    }, 2500);
  }, 1000);
}

/**
 * ✅ Typewriter Effect Function
 */
function initTypewriter() {
  const words = ["future", "portfolio", "collaboration"];
  const typewriter = document.getElementById("typewriter");

  // Guard against missing element
  if (!typewriter) {
    console.warn("⚠️ Typewriter element not found");
    return;
  }

  let wordIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];
    const visible = currentWord.substring(0, letterIndex);
    typewriter.textContent = visible;

    if (!isDeleting && letterIndex < currentWord.length) {
      letterIndex++;
      setTimeout(typeEffect, 150); // typing speed
    } else if (isDeleting && letterIndex > 0) {
      letterIndex--;
      setTimeout(typeEffect, 80); // deleting speed
    } else {
      if (!isDeleting) {
        isDeleting = true;
        setTimeout(typeEffect, 1000); // pause before deleting
      } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 300); // small pause before typing next word
      }
    }
  }

  // Start the typewriter effect
  typeEffect();
}

/**
 * Start and configure the Three.js 3D scene
 */
function start3DScene(canvas, logoScreen) {
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
    "./assets/images/slider-image-1.avif",
    "./assets/images/slider-image-2.avif",
    "./assets/images/slider-image-3.avif",
    "./assets/images/slider-image-4.avif",
    "./assets/images/slider-image-5.avif",
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
  let currentTilt = 0;
  let floatOffset = 0;

  let startTime = Date.now();
  const moveDuration = 9000;
  const startZ = 10;
  const endZ = 1.5;
  const startScale = 0.3;
  const endScale = 2;

  // ✅ Speed control: FAST when FAR, SLOW when CLOSE
  const minSpeed = 0.2; // ✅ Slow when CLOSE
  const maxSpeed = 10;  // ✅ Fast when FAR
  const minDistance = 1.5; // Closest distance
  const maxDistance = 50;  // Farthest distance

  // -------------------------------------------------------
  // 🔒 NEW: SCROLL BLOCKING SYSTEM
  // -------------------------------------------------------
  let scrollLocked = false;
  let hasUserScrolled = false;
  let animationPhase = 0; // 0: idle, 1: speed up, 2: zoom out, 3: released

  function preventScroll(e) {
    if (scrollLocked) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function lockScroll() {
    scrollLocked = true;
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    scrollLocked = false;
    document.body.style.overflow = '';
  }

  // -------------------------------------------------------
  // 🌪️ MODIFIED: Scroll Logic with Locking
  // -------------------------------------------------------
  let isZoomedOut = false;
  let isTransitioning = false;

  const zoomOutZ = 50;
  const zoomInZ = 35;
  const normalSpinSpeed = 0.09;
  const fastSpinSpeed = 0.8;
  const zoomDuration = 2000;

  const bgImage = document.getElementById("bgImage");
  const heroSection = document.getElementById("heroSectionContent");

  window.addEventListener("wheel", (event) => {
    // Prevent scroll if locked
    if (scrollLocked) {
      event.preventDefault();
      return;
    }

    if (isTransitioning) return;

    // Only trigger on downward scroll in hero section
    if (event.deltaY > 0 && !isZoomedOut && isInHeroSection()) {
      event.preventDefault();
      
      if (!hasUserScrolled) {
        hasUserScrolled = true;
        lockScroll(); // 🔒 Lock scroll during animation sequence
        startScrollSequence();
      }
    }
    // Scroll Up → Return to normal state
    else if (event.deltaY < 0 && isZoomedOut) {
      isTransitioning = true;
      fadeBackground("./assets/images/hero-1.avif");
      zoomCamera(zoomInZ, () => {
        isZoomedOut = false;
        baseRotationSpeed = normalSpinSpeed;
        isTransitioning = false;
      });
    }
  }, { passive: false });

  // -------------------------------------------------------
  // 🎬 NEW: Animation Sequence Controller
  // -------------------------------------------------------
  function startScrollSequence() {
    animationPhase = 1;
    
    // Phase 1: Speed up carousel (1.5 seconds)
    isTransitioning = true;
    const speedUpDuration = 1500;
    const speedUpStart = Date.now();
    
    function speedUpAnimation() {
      const elapsed = Date.now() - speedUpStart;
      const t = Math.min(elapsed / speedUpDuration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      
      baseRotationSpeed = THREE.MathUtils.lerp(normalSpinSpeed, fastSpinSpeed * 1.5, ease);
      
      if (t < 1) {
        requestAnimationFrame(speedUpAnimation);
      } else {
        // Phase 2: Zoom out
        animationPhase = 2;
        startZoomOutSequence();
      }
    }
    
    speedUpAnimation();
  }

  function startZoomOutSequence() {
    spinFast();
    fadeBackground("./assets/images/hero-2.avif");
    zoomCamera(zoomOutZ, () => {
      isZoomedOut = true;
      isTransitioning = false;
      animationPhase = 3;
      
      // 🔓 Unlock scroll after animation completes
      setTimeout(() => {
        unlockScroll();
        hasUserScrolled = false;
        window.dispatchEvent(new Event("heroAnimationComplete"));
        
        // Auto scroll to next section
        const secondSection = document.getElementById("section1");
        if (secondSection) {
          secondSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    });
  }

  // Helper to check if user is in hero section
  function isInHeroSection() {
    if (!heroSection) return true;
    const rect = heroSection.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom > 0;
  }

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
// -------------------------------------------------------
// 🎥 Zoom Animation with Tilt
// -------------------------------------------------------
function zoomCamera(targetZ, onComplete) {
  const startZ = camera.position.z;
  const startTime = Date.now();
  
  // ✅ ADD: Store starting rotation and calculate target tilt
  const startRotationX = group.rotation.x;
  const targetTilt = targetZ > startZ ? 0.4 : 0; // Tilt forward when zooming out, reset when zooming in

  function animateZoom() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / zoomDuration, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    // ✅ ANIMATE: Camera zoom
    camera.position.z = THREE.MathUtils.lerp(startZ, targetZ, ease);
    
    // ✅ ANIMATE: Group tilt (rotation.x)
    group.rotation.x = THREE.MathUtils.lerp(startRotationX, targetTilt, ease);
    
    renderer.render(scene, camera);
    
    if (t < 1) requestAnimationFrame(animateZoom);
    else if (onComplete) onComplete();
  }
  
  animateZoom();
}

  // -------------------------------------------------------
  // ✅ CORRECTED: Calculate rotation speed - FAST when FAR, SLOW when CLOSE
  // -------------------------------------------------------
  function getSpeedFromDistance(distance) {
    // Clamp distance to min/max range
    const clampedDist = Math.max(minDistance, Math.min(maxDistance, distance));

    // ✅ CORRECT: Normalize distance (0 = close, 1 = far)
    const normalizedDist = (clampedDist - minDistance) / (maxDistance - minDistance);

    // ✅ Direct mapping (NO INVERSION):
    // far (normalizedDist = 1) → maxSpeed
    // close (normalizedDist = 0) → minSpeed
    return minSpeed + (maxSpeed - minSpeed) * normalizedDist;
  }

  // -------------------------------------------------------
  // 👀 Handle circle fade + section cross-fade
  // -------------------------------------------------------
  const secondSection = document.getElementById("section1");
  const transitionOverlay = document.getElementById("transitionOverlay");

  window.addEventListener("scroll", () => {
    if (!secondSection || !transitionOverlay) return;
    const rect = secondSection.getBoundingClientRect();

    // When starting to reach 2nd section
    if (rect.top < window.innerHeight * 0.8) {
      canvas.style.transition = "opacity 1s ease";
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.visibility = "hidden";

      transitionOverlay.style.opacity = "1";

      setTimeout(() => {
        transitionOverlay.style.opacity = "0";
        secondSection.style.transition = "opacity 1s ease";
        secondSection.style.opacity = "1";
      }, 1000);
    } else if (rect.top >= window.innerHeight) {
      // 🔄 NEW: Reset when scrolling back to hero
      secondSection.style.transition = "opacity 1s ease";
      secondSection.style.opacity = "0";

      transitionOverlay.style.opacity = "1";
      setTimeout(() => {
        transitionOverlay.style.opacity = "0";
        canvas.style.transition = "opacity 1s ease";
        canvas.style.opacity = "1";
        canvas.style.pointerEvents = "auto";
        canvas.style.visibility = "visible";
        
        // Reset animation state
        isZoomedOut = false;
        hasUserScrolled = false;
        animationPhase = 0;
        fadeBackground("./assets/images/hero-1.avif");
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

    // ✅ Dynamic rotation speed based on camera distance
    const currentDistance = camera.position.z;
    const distanceBasedSpeed = getSpeedFromDistance(currentDistance);

    // Apply speed (override during transitions)
    const finalSpeed = isTransitioning ? baseRotationSpeed : distanceBasedSpeed;
    group.rotation.y += finalSpeed * 0.02;

    currentTilt += (targetTilt - currentTilt) * 0.1;
    const bowTilt = THREE.MathUtils.lerp(0.9, 0, ease);
    group.rotation.x = currentTilt + bowTilt;

    // ✅ Re-enable floating
    // floatOffset += 0.01 + finalSpeed * 0.1;
    // group.position.y = -1 + Math.sin(floatOffset) * 0.08;

    renderer.render(scene, camera);

    // Fade overlay based on distance
    const overlay = document.getElementById("textOverlay");
    if (overlay) {
      overlay.style.opacity = camera.position.z < 4 ? "1" : "0";
    }
  }

  animate();

  // Handle Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); // ✅ Fixed bug
  });
}
