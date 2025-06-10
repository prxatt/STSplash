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

// Restart on click
surfaceText.addEventListener('click', () => {
  clearInterval(languageCycle);
  index = 0;
  isAnimating = true;
  surfaceText.textContent = languages[0];
  startLanguageCycle();
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

// ⭐️ Enhanced Cursor Trail with smoother movement
const trail = document.getElementById("cursor-trail");
const trailElements = [];
const maxTrailLength = 15;

// Create trail elements
for (let i = 0; i < maxTrailLength; i++) {
  const trailElement = document.createElement('div');
  trailElement.className = 'cursor-trail-element';
  trailElement.style.opacity = (1 - i / maxTrailLength) * 0.7;
  trailElement.style.transform = `scale(${1 - i / maxTrailLength})`;
  document.body.appendChild(trailElement);
  trailElements.push(trailElement);
}

let mouseX = 0, mouseY = 0;
const trailPositions = [];

function updateCursor(x, y) {
  mouseX = x;
  mouseY = y;
  
  // Update main cursor
  trail.style.left = `${mouseX}px`;
  trail.style.top = `${mouseY}px`;
  
  // Store position for smooth trail
  trailPositions.unshift({ x: mouseX, y: mouseY });
  if (trailPositions.length > maxTrailLength) {
    trailPositions.pop();
  }
  
  // Update trail elements with smooth interpolation
  trailElements.forEach((element, i) => {
    if (trailPositions[i + 1]) {
      element.style.left = `${trailPositions[i + 1].x}px`;
      element.style.top = `${trailPositions[i + 1].y}px`;
    }
  });
}

document.addEventListener("mousemove", (e) => {
  updateCursor(e.clientX, e.clientY);
});

// Touch support
document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
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
  }, 1000);
}

// Create ripples on mouse movement (reduced frequency)
document.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.05) { // 5% chance for smoother performance
    createRipple(e.clientX, e.clientY, 0.8);
  }
});

// Touch ripples
document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  createRipple(touch.clientX, touch.clientY, 1.2);
});

// ⭐️ Subtext interaction for "12525" hidden text
const subtext = document.getElementById('subtext');
let subtextTimeout;

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

// ⭐️ Enhanced Three.js Point Cloud Background - Improved Performance
let scene, camera, renderer, pointCloud;
let mouse = { x: 0, y: 0 };
let time = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let rotation = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

// Touch variables
let touches = [];
let lastTouchDistance = 0;
let cameraDistance = 100;

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

  // Create enhanced sphere geometry point cloud
  const particleCount = window.innerWidth < 768 ? 4000 : 8000; // Optimized count
  const sphereGeometry = new THREE.SphereGeometry(0.15, 8, 6); // Optimized sphere detail
  
  // Use shader material for better performance and effects
  const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      mouse: { value: new THREE.Vector2() }
    },
    vertexShader: `
      varying vec3 vColor;
      varying vec3 vPosition;
      uniform float time;
      uniform vec2 mouse;
      
      void main() {
        vColor = color;
        vPosition = position;
        
        // Dynamic positioning with wave effects
        vec3 pos = position;
        pos.x += sin(time + position.y * 0.01) * 2.0;
        pos.y += cos(time + position.x * 0.01) * 1.5;
        pos.z += sin(time * 0.5 + position.x * 0.005 + position.y * 0.005) * 1.0;
        
        // Mouse interaction
        vec2 mouseInfluence = mouse * 10.0;
        pos.xy += mouseInfluence * 0.1;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying vec3 vPosition;
      
      void main() {
        // Dynamic color based on position and time
        vec3 color = vColor;
        float intensity = 0.8 + sin(vPosition.x * 0.01 + vPosition.y * 0.01) * 0.2;
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
    // Smooth rotation interpolation
    rotation.x += (targetRotation.x - rotation.x) * 0.05;
    rotation.y += (targetRotation.y - rotation.y) * 0.05;

    // Enhanced rotation with mouse influence and organic movement
    pointCloud.rotation.x = rotation.x + Math.sin(time * 0.3) * 0.1 + mouse.y * 0.0001;
    pointCloud.rotation.y = rotation.y + Math.cos(time * 0.2) * 0.1 + mouse.x * 0.0001;
    pointCloud.rotation.z += 0.0003;

    // Update shader uniforms
    if (pointCloud.material.uniforms) {
      pointCloud.material.uniforms.time.value = time;
      pointCloud.material.uniforms.mouse.value.set(mouse.x, mouse.y);
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

// Enhanced Mouse/Touch Controls
function onPointerStart(e) {
  isDragging = true;
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
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;
      
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;

      // Create drag ripples
      if (Math.random() < 0.3) {
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
      
      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;
      
      dragStart.x = touches[0].clientX;
      dragStart.y = touches[0].clientY;

      // Create touch ripples
      createRipple(touches[0].clientX, touches[0].clientY, 0.9);
    } else if (touches.length === 2) {
      // Two finger pinch/zoom
      const currentDistance = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
      
      if (lastTouchDistance > 0) {
        const deltaDistance = currentDistance - lastTouchDistance;
        cameraDistance = Math.max(50, Math.min(200, cameraDistance - deltaDistance * 0.3));
      }
      
      lastTouchDistance = currentDistance;
    }
  }
}

function onPointerEnd(e) {
  isDragging = false;
  touches = [];
  lastTouchDistance = 0;
}

// Mouse events
document.addEventListener('mousedown', onPointerStart);
document.addEventListener('mousemove', onPointerMove);
document.addEventListener('mouseup', onPointerEnd);

// Touch events
document.addEventListener('touchstart', onPointerStart, { passive: false });
document.addEventListener('touchmove', onPointerMove, { passive: false });
document.addEventListener('touchend', onPointerEnd);

// Wheel zoom
document.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 5 : -5;
  cameraDistance = Math.max(30, Math.min(300, cameraDistance + delta));
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
