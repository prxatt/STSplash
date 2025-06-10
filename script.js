// ⭐️ Language Cycle - Fast slot machine style
const languages = [
  "表面張力", "सतह तनाव", "Поверхностное натяжение", "Tension superficielle", 
  "Oberflächenspannung", "Tensión superficial", "Tensione superficiale", "表面張力",
  "표면장력", "الشد السطحي", "Oppervlaktespanning", "Naprężenie powierzchniowe",
  "Ytspänning", "Поверхностное натяжение", "Pintarjännitys", "Τάση επιφανείας",
  "Tensão superficial", "Yüzey gerilimi", "Overflatespenning", "Felületi feszültség",
  "Povrchové napětí", "Površana تنسیون", "Površinska napetost", "Paviršiaus įtempis",
  "Virsmas spriegums", "Pindtähe", "Yüzey gerilimi", "Površinsko naprezanje",
  "Površinska напнатост", "Površinska napetost", "Povrchové napätie", "Napětí povrchu",
  "SURFACE TENSION"
];

let index = 0;
let isAnimating = true;
let animationSpeed = 80; // Fast slot machine speed
let languageCycle;
const surfaceText = document.getElementById("surface-text");

function cycleLanguages() {
  if (!isAnimating) return;
  
  surfaceText.textContent = languages[index];
  
  // When reaching "SURFACE TENSION", pause for 3 seconds then restart
  if (languages[index] === "SURFACE TENSION") {
    clearInterval(languageCycle);
    isAnimating = false;
    setTimeout(() => {
      index = 0;
      isAnimating = true;
      startLanguageCycle();
    }, 3000);
  } else {
    index = (index + 1) % languages.length;
  }
}

function startLanguageCycle() {
  languageCycle = setInterval(cycleLanguages, animationSpeed);
}

// Start the cycle
startLanguageCycle();

// Enhanced restart function for both click and touch
function restartLanguageCycle() {
  clearInterval(languageCycle);
  index = 0;
  isAnimating = true;
  surfaceText.textContent = languages[0];
  startLanguageCycle();
}

// Enhanced click/touch handlers for Surface Tension text
surfaceText.addEventListener('click', restartLanguageCycle);
surfaceText.addEventListener('touchstart', (e) => {
  e.preventDefault();
  restartLanguageCycle();
  createTouchRipple(e.touches[0].clientX, e.touches[0].clientY);
});

// ⭐️ Audio Control - Enhanced with multiple fallbacks
const music = document.getElementById("bg-music");
const muteBtn = document.getElementById("mute-btn");
const playIcon = muteBtn.querySelector('.play');
const muteIcon = muteBtn.querySelector('.mute');

let isPlaying = false;
let userInteracted = false;

// Enhanced audio initialization with multiple attempts
function initAudio() {
  // Set volume
  music.volume = 0.7;
  
  // Try to play immediately
  music.play().then(() => {
    isPlaying = true;
    playIcon.style.display = 'block';
    muteIcon.style.display = 'none';
    console.log('✅ Music auto-started successfully');
  }).catch(e => {
    console.log('⚠️ Auto-play blocked, waiting for user interaction');
    isPlaying = false;
    playIcon.style.display = 'none';
    muteIcon.style.display = 'block';
  });
}

// Try multiple initialization methods
window.addEventListener('load', initAudio);
document.addEventListener('DOMContentLoaded', initAudio);

// Enhanced mute button with better feedback
muteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  userInteracted = true;
  
  if (isPlaying) {
    music.pause();
    playIcon.style.display = 'none';
    muteIcon.style.display = 'block';
    isPlaying = false;
    console.log('🔇 Music paused');
  } else {
    music.play().then(() => {
      playIcon.style.display = 'block';
      muteIcon.style.display = 'none';
      isPlaying = true;
      console.log('🔊 Music resumed');
    }).catch(e => {
      console.error('❌ Audio play failed:', e);
      // Try alternative approach
      setTimeout(() => {
        music.load();
        music.play().catch(err => console.error('Audio still failing:', err));
      }, 100);
    });
  }
});

// Enhanced fallback system - try multiple times
let autoPlayAttempts = 0;
const maxAttempts = 3;

function attemptAutoPlay() {
  if (autoPlayAttempts >= maxAttempts || isPlaying) return;
  
  autoPlayAttempts++;
  userInteracted = true;
  
  music.play().then(() => {
    isPlaying = true;
    playIcon.style.display = 'block';
    muteIcon.style.display = 'none';
    console.log(`✅ Auto-play successful on attempt ${autoPlayAttempts}`);
  }).catch(e => {
    console.log(`⚠️ Auto-play attempt ${autoPlayAttempts} failed`);
    if (autoPlayAttempts < maxAttempts) {
      setTimeout(attemptAutoPlay, 1000);
    }
  });
}

// Multiple trigger events for auto-play
document.addEventListener('click', attemptAutoPlay, { once: true });
document.addEventListener('touchstart', attemptAutoPlay, { once: true });
document.addEventListener('keydown', attemptAutoPlay, { once: true });
document.addEventListener('mousemove', attemptAutoPlay, { once: true });

// ⭐️ Enhanced Cursor Trail with smoother movement and sphere interaction
const trail = document.getElementById("cursor-trail");
const trailElements = [];
const sphereTrailElements = [];
const maxTrailLength = 20;
const maxSphereTrailLength = 15;

// Create cursor trail elements
for (let i = 0; i < maxTrailLength; i++) {
  const trailElement = document.createElement('div');
  trailElement.className = 'cursor-trail-element';
  trailElement.style.opacity = (1 - i / maxTrailLength) * 0.8;
  trailElement.style.transform = `scale(${1 - i / maxTrailLength * 0.6})`;
  document.body.appendChild(trailElement);
  trailElements.push(trailElement);
}

// Create sphere interaction trail elements
for (let i = 0; i < maxSphereTrailLength; i++) {
  const sphereTrail = document.createElement('div');
  sphereTrail.className = 'sphere-trail';
  sphereTrail.style.opacity = (1 - i / maxSphereTrailLength) * 0.7;
  sphereTrail.style.transform = `scale(${1 - i / maxSphereTrailLength * 0.5}) translate(-50%, -50%)`;
  document.body.appendChild(sphereTrail);
  sphereTrailElements.push(sphereTrail);
}

let mouseX = 0, mouseY = 0;
let lastMouseX = 0, lastMouseY = 0;
const trailPositions = [];
const sphereTrailPositions = [];
let isOverPointCloud = false;
let touchTrailElements = [];

function updateCursor(x, y) {
  mouseX = x;
  mouseY = y;
  
  // Calculate movement speed for trail intensity
  const speed = Math.sqrt((x - lastMouseX) ** 2 + (y - lastMouseY) ** 2);
  const intensity = Math.min(speed / 10, 1);
  
  // Update main cursor with dynamic sizing based on movement
  trail.style.left = `${mouseX}px`;
  trail.style.top = `${mouseY}px`;
  trail.style.transform = `translate(-50%, -50%) scale(${0.8 + intensity * 0.4})`;
  
  // Store position for smooth trail
  trailPositions.unshift({ x: mouseX, y: mouseY, intensity });
  if (trailPositions.length > maxTrailLength) {
    trailPositions.pop();
  }
  
  // Update cursor trail elements with smooth interpolation
  trailElements.forEach((element, i) => {
    if (trailPositions[i + 1]) {
      element.style.left = `${trailPositions[i + 1].x}px`;
      element.style.top = `${trailPositions[i + 1].y}px`;
      element.style.opacity = (1 - i / maxTrailLength) * 0.8 * (trailPositions[i + 1].intensity + 0.3);
    }
  });
  
  // Handle sphere trail when over point cloud
  if (isOverPointCloud) {
    sphereTrailPositions.unshift({ x: mouseX, y: mouseY });
    if (sphereTrailPositions.length > maxSphereTrailLength) {
      sphereTrailPositions.pop();
    }
    
    sphereTrailElements.forEach((element, i) => {
      if (sphereTrailPositions[i]) {
        element.style.left = `${sphereTrailPositions[i].x}px`;
        element.style.top = `${sphereTrailPositions[i].y}px`;
        element.style.opacity = (1 - i / maxSphereTrailLength) * 0.9;
        element.style.display = 'block';
      }
    });
  } else {
    // Fade out sphere trails when not over point cloud
    sphereTrailElements.forEach(element => {
      element.style.opacity = '0';
      setTimeout(() => {
        if (element.style.opacity === '0') {
          element.style.display = 'none';
        }
      }, 300);
    });
  }
  
  lastMouseX = x;
  lastMouseY = y;
}

document.addEventListener("mousemove", (e) => {
  updateCursor(e.clientX, e.clientY);
});

// Enhanced touch support with trail effects
function createTouchTrail(x, y) {
  const touchTrail = document.createElement('div');
  touchTrail.className = 'cursor-trail-element';
  touchTrail.style.left = `${x}px`;
  touchTrail.style.top = `${y}px`;
  touchTrail.style.opacity = '0.8';
  touchTrail.style.background = 'radial-gradient(circle, #ff6b6b 0%, rgba(255, 107, 107, 0.4) 60%, transparent)';
  document.body.appendChild(touchTrail);
  touchTrailElements.push(touchTrail);
  
  // Animate and remove
  setTimeout(() => {
    touchTrail.style.opacity = '0';
    touchTrail.style.transform = 'translate(-50%, -50%) scale(2)';
    setTimeout(() => {
      document.body.removeChild(touchTrail);
      touchTrailElements = touchTrailElements.filter(el => el !== touchTrail);
    }, 300);
  }, 100);
}

document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  createTouchTrail(touch.clientX, touch.clientY);
  updateCursor(touch.clientX, touch.clientY);
});

// ⭐️ Enhanced Ripple Effect system
const rippleContainer = document.getElementById('ripple-container');

function createRipple(x, y, size = 1) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = `${20 * size}px`;
  ripple.style.height = `${20 * size}px`;
  rippleContainer.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 1200);
}

function createTouchRipple(x, y, size = 1) {
  const ripple = document.createElement('div');
  ripple.className = 'touch-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = `${25 * size}px`;
  ripple.style.height = `${25 * size}px`;
  rippleContainer.appendChild(ripple);
  
  // Create touch feedback circle
  const feedback = document.createElement('div');
  feedback.className = 'touch-feedback';
  feedback.style.left = `${x}px`;
  feedback.style.top = `${y}px`;
  document.body.appendChild(feedback);
  
  // Remove elements after animation
  setTimeout(() => {
    ripple.remove();
    feedback.remove();
  }, 800);
}

// Create ripples on mouse movement (reduced frequency for performance)
document.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.03) { // 3% chance for smoother performance
    createRipple(e.clientX, e.clientY, 0.6);
  }
});

// Enhanced touch ripples
document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  createTouchRipple(touch.clientX, touch.clientY, 1.2);
});

// ⭐️ Subtext interaction for "12525" hidden text
const subtext = document.getElementById('subtext');
let subtextTimeout;

if (subtext) {
  // Mouse events
  subtext.addEventListener('mouseenter', () => {
    subtext.classList.add('show-hidden');
  });

  subtext.addEventListener('mouseleave', () => {
    subtext.classList.remove('show-hidden');
  });

  // Touch and hold for mobile
  subtext.addEventListener('touchstart', (e) => {
    e.preventDefault();
    subtext.classList.add('show-hidden');
    subtextTimeout = setTimeout(() => {
      subtext.classList.remove('show-hidden');
    }, 3000);
  });

  subtext.addEventListener('touchend', () => {
    clearTimeout(subtextTimeout);
    setTimeout(() => {
      subtext.classList.remove('show-hidden');
    }, 500);
  });
}

// ⭐️ Enhanced Three.js Point Cloud Background - Improved Performance
let scene, camera, renderer, pointCloud;
let mouse = { x: 0, y: 0 };
let time = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let rotation = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

// Touch variables for enhanced interaction
let touches = [];
let lastTouchDistance = 0;
let cameraDistance = 100;
let isRotating = false;
let rotationVelocity = { x: 0, y: 0 };

// Raycaster for sphere interaction detection
let raycaster = new THREE.Raycaster();
let intersectedObjects = [];

function initThreeJS() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById("bg-canvas"),
    antialias: window.innerWidth > 768, // Conditional antialiasing for performance
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = cameraDistance;

  // Initialize raycaster
  raycaster = new THREE.Raycaster();

  // Create enhanced sphere geometry point cloud
  const particleCount = window.innerWidth < 768 ? 4000 : 8000; // Optimized count
  const sphereGeometry = new THREE.SphereGeometry(0.15, 8, 6); // Optimized sphere detail
  
  // Use shader material for better performance and effects
  const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      mouse: { value: new THREE.Vector2() },
      hovering: { value: 0.0 }
    },
    vertexShader: `
      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vHover;
      uniform float time;
      uniform vec2 mouse;
      uniform float hovering;
      
      void main() {
        vColor = color;
        vPosition = position;
        
        // Dynamic positioning with wave effects
        vec3 pos = position;
        pos.x += sin(time + position.y * 0.01) * 2.0;
        pos.y += cos(time + position.x * 0.01) * 1.5;
        pos.z += sin(time * 0.5 + position.x * 0.005 + position.y * 0.005) * 1.0;
        
        // Mouse interaction for hover effects
        vec2 mouseInfluence = mouse * 10.0;
        pos.xy += mouseInfluence * 0.1;
        
        // Hover scaling effect
        vHover = hovering;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying vec3 vPosition;
      varying float vHover;
      
      void main() {
        // Dynamic color based on position and hover state
        vec3 color = vColor;
        float intensity = 0.8 + sin(vPosition.x * 0.01 + vPosition.y * 0.01) * 0.2;
        
        // Enhance color when hovering
        if (vHover > 0.1) {
          color = mix(color, vec3(1.0, 1.0, 1.0), vHover * 0.3);
          intensity += vHover * 0.4;
        }
        
        gl_FragColor = vec4(color * intensity, 0.8);
      }
    `,
    transparent: true,
    vertexColors: true
  });

  // Create instanced mesh for better performance
  const instancedMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, particleCount);
  
  const dummy = new THREE.Object3D();
  const colors = [];
  
  for (let i = 0; i < particleCount; i++) {
    // Enhanced positioning with organic clusters
    if (Math.random() < 0.4) {
      // Clustered particles
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 80 + 30;
      dummy.position.set(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 60,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 150
      );
    } else {
      // Scattered particles
      dummy.position.set(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
      );
    }
    
    // Enhanced scale variation
    const scale = Math.random() * 1.2 + 0.3;
    dummy.scale.set(scale, scale, scale);
    
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
    
    // Enhanced color variation
    const color = new THREE.Color();
    const hue = 0.5 + Math.sin(i * 0.1) * 0.3; // Dynamic hue based on index
    const saturation = 0.8 + Math.random() * 0.2;
    const lightness = 0.4 + Math.random() * 0.4;
    color.setHSL(hue, saturation, lightness);
    colors.push(color.r, color.g, color.b);
  }
  
  // Set colors and update matrices
  instancedMesh.instanceMatrix.needsUpdate = true;
  const colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(colors), 3);
  instancedMesh.geometry.setAttribute('color', colorAttribute);
  
  pointCloud = instancedMesh;
  scene.add(pointCloud);

  // Add subtle ambient lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);
  
  console.log('✅ Three.js initialized with', particleCount, 'particles');
}

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  if (pointCloud) {
    // Smooth rotation interpolation with momentum
    rotation.x += (targetRotation.x - rotation.x) * 0.08;
    rotation.y += (targetRotation.y - rotation.y) * 0.08;
    
    // Add rotation velocity for smooth momentum
    rotation.x += rotationVelocity.x;
    rotation.y += rotationVelocity.y;
    
    // Apply damping to velocity
    rotationVelocity.x *= 0.95;
    rotationVelocity.y *= 0.95;

    // Enhanced rotation with mouse influence and organic movement
    pointCloud.rotation.x = rotation.x + Math.sin(time * 0.3) * 0.1 + mouse.y * 0.0001;
    pointCloud.rotation.y = rotation.y + Math.cos(time * 0.2) * 0.1 + mouse.x * 0.0001;
    pointCloud.rotation.z += 0.0003;

    // Update shader uniforms
    if (pointCloud.material.uniforms) {
      pointCloud.material.uniforms.time.value = time;
      pointCloud.material.uniforms.mouse.value.set(mouse.x, mouse.y);
      pointCloud.material.uniforms.hovering.value = isOverPointCloud ? 1.0 : 0.0;
    }

    // Enhanced pulsing effect with multiple harmonics
    const scale = 1 + Math.sin(time * 1.5) * 0.02 + Math.cos(time * 2.3) * 0.01;
    pointCloud.scale.set(scale, scale, scale);

    // Dynamic camera movement
    camera.position.x = Math.sin(time * 0.2) * 3;
    camera.position.y = Math.cos(time * 0.15) * 2;
    camera.position.z = cameraDistance + Math.sin(time * 0.5) * 5;
    camera.lookAt(scene.position);
  }

  renderer.render(scene, camera);
}

// Enhanced Mouse/Touch Controls with precise point cloud interaction
function onPointerStart(e) {
  isDragging = true;
  isRotating = true;
  
  if (e.type === 'mousedown') {
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
  } else if (e.type === 'touchstart') {
    touches = Array.from(e.touches);
    if (touches.length === 1) {
      dragStart.x = touches[0].clientX;
      dragStart.y = touches[0].clientY;
    } else if (touches.length === 2) {
      lastTouchDistance = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
    }
  }
}

function onPointerMove(e) {
  if (e.type === 'mousemove') {
    // Update mouse coordinates for shader and raycasting
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Detect if hovering over point cloud
    if (pointCloud) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(pointCloud);
      isOverPointCloud = intersects.length > 0;
      
      if (isOverPointCloud) {
        document.body.style.cursor = 'grab';
      } else {
        document.body.style.cursor = 'none';
      }
    }

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Enhanced rotation sensitivity
      const sensitivity = 0.01;
      targetRotation.y += deltaX * sensitivity;
      targetRotation.x += deltaY * sensitivity;
      
      // Add velocity for momentum
      rotationVelocity.y += deltaX * sensitivity * 0.1;
      rotationVelocity.x += deltaY * sensitivity * 0.1;
      
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;

      // Create drag ripples when interacting with point cloud
      if (isOverPointCloud && Math.random() < 0.3) {
        createRipple(e.clientX, e.clientY, 0.6);
      }
    }
  } else if (e.type === 'touchmove') {
    e.preventDefault();
    touches = Array.from(e.touches);
    
    if (touches.length === 1 && isDragging) {
      // Single finger drag - rotate camera
      const deltaX = touches[0].clientX - dragStart.x;
      const deltaY = touches[0].clientY - dragStart.y;
      
      const sensitivity = 0.012;
      targetRotation.y += deltaX * sensitivity;
      targetRotation.x += deltaY * sensitivity;
      
      // Add velocity for momentum
      rotationVelocity.y += deltaX * sensitivity * 0.1;
      rotationVelocity.x += deltaY * sensitivity * 0.1;
      
      dragStart.x = touches[0].clientX;
      dragStart.y = touches[0].clientY;

      // Create touch ripples
      createTouchRipple(touches[0].clientX, touches[0].clientY, 0.9);
    } else if (touches.length === 2) {
      // Two finger pinch/zoom and rotation
      const currentDistance = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
      
      if (lastTouchDistance > 0) {
        const deltaDistance = currentDistance - lastTouchDistance;
        cameraDistance = Math.max(50, Math.min(300, cameraDistance - deltaDistance * 0.3));
      }
      
      lastTouchDistance = currentDistance;
      
      // Two finger rotation
      const centerX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerY = (touches[0].clientY + touches[1].clientY) / 2;
      const angle = Math.atan2(
        touches[1].clientY - touches[0].clientY,
        touches[1].clientX - touches[0].clientX
      );
      
      if (this.lastAngle !== undefined) {
        const deltaAngle = angle - this.lastAngle;
        targetRotation.z += deltaAngle * 0.5;
      }
      this.lastAngle = angle;
    }
  }
}

function onPointerEnd(e) {
  isDragging = false;
  isRotating = false;
  touches = [];
  lastTouchDistance = 0;
  this.lastAngle = undefined;
  
  // Reset cursor
  document.body.style.cursor = 'none';
}

// Mouse events
document.addEventListener('mousedown', onPointerStart);
document.addEventListener('mousemove', onPointerMove);
document.addEventListener('mouseup', onPointerEnd);

// Touch events
document.addEventListener('touchstart', onPointerStart, { passive: false });
document.addEventListener('touchmove', onPointerMove, { passive: false });
document.addEventListener('touchend', onPointerEnd);

// Enhanced wheel zoom with smooth acceleration
document.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 5 : -5;
  const zoomSpeed = Math.abs(e.deltaY) > 100 ? 2 : 1; // Faster zoom for larger wheel movements
  cameraDistance = Math.max(30, Math.min(300, cameraDistance + delta * zoomSpeed));
  
  // Create zoom ripple effect
  if (Math.random() < 0.5) {
    createRipple(e.clientX, e.clientY, 0.4);
  }
}, { passive: false });

// Window resize handler
window.addEventListener('resize', () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

// ⭐️ Enhanced Glitch Effect for Text
function addGlitchEffect() {
  const textElement = document.getElementById('surface-text');
  if (Math.random() < 0.03) { // 3% chance for subtlety
    textElement.style.textShadow = `
      2px 0 #ff0000,
      -2px 0 #00ffff,
      0 2px #ff00ff,
      0 -2px #ffff00
    `;
    setTimeout(() => {
      textElement.style.textShadow = `
        0 0 20px rgba(0, 255, 255, 0.8),
        0 0 40px rgba(0, 255, 255, 0.6),
        0 0 60px rgba(0, 255, 255, 0.4),
        0 0 80px rgba(0, 255, 255, 0.2)
      `;
    }, 100);
  }
}

// Apply glitch effect occasionally
setInterval(addGlitchEffect, 200);

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  animate();
  console.log('🚀 Surface Tension fully initialized');
});

// Debug logging
console.log('📱 Device:', window.innerWidth < 768 ? 'Mobile' : 'Desktop');
console.log('🎮 Touch support:', 'ontouchstart' in window);
console.log('🎵 Audio element:', music ? 'Found' : 'Missing');
console.log('🌐 Three.js:', typeof THREE !== 'undefined' ? 'Loaded' : 'Missing');
