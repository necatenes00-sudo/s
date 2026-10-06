import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function initScene(reducedMotion) {
  const canvas = document.querySelector('#hero-canvas');
  const container = canvas.parentElement;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    container.dataset.renderer = 'fallback';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0, 7.5);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const environmentTexture = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentTexture.texture;
  environment.dispose();
  pmrem.dispose();

  const sculpture = new THREE.Group();
  const geometry = new THREE.TorusKnotGeometry(1.17, 0.37, 160, 28, 2, 3);
  const material = new THREE.MeshStandardMaterial({ color: 0xc7c8b7, metalness: 1, roughness: 0.19, envMapIntensity: 1.7 });
  const knot = new THREE.Mesh(geometry, material);
  sculpture.add(knot);
  scene.add(sculpture);
  sculpture.rotation.set(0.35, 0.45, -0.48);
  sculpture.position.set(0.12, 0.12, 0);
  const orangeLight = new THREE.PointLight(0xff5831, 35, 12, 2);
  orangeLight.position.set(-2, -2, 2);
  scene.add(orangeLight);
  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(3, 4, 3);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xd7e0ca, 4);
  rimLight.position.set(-3, 2, -1);
  scene.add(rimLight);

  let visible = true;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let scroll = 0;
  let elapsed = 0;
  let previousTime = 0;
  const pointer = event => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.22;
  };
  const onScroll = () => {
    scroll = Math.min(window.scrollY / document.querySelector('.hero').offsetHeight, 1.2);
  };
  function render(time = 0) {
    frame = 0;
    if (!visible || document.hidden) { previousTime = 0; return; }
    if (!reducedMotion) {
      elapsed += previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      sculpture.rotation.x += (0.35 + pointerY + scroll * 1.1 - sculpture.rotation.x) * 0.035;
      sculpture.rotation.y += (0.45 + elapsed * 0.12 + pointerX + scroll * 1.8 - sculpture.rotation.y) * 0.035;
      sculpture.rotation.z = -0.48 + Math.sin(elapsed * 0.22) * 0.1 + scroll * 0.35;
      sculpture.position.y = 0.12 + Math.sin(elapsed * 0.65) * 0.075 + scroll * 0.3;
      sculpture.scale.setScalar(1 - scroll * 0.12);
    }
    renderer.render(scene, camera);
    if (!reducedMotion) frame = requestAnimationFrame(render);
  }
  function schedule() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); }
  function resize() {
    const bounds = container.getBoundingClientRect();
    camera.aspect = bounds.width / bounds.height;
    camera.position.z = window.innerWidth < 761 ? 10.5 : 9.8;
    camera.updateProjectionMatrix();
    renderer.setSize(bounds.width, bounds.height, false);
    schedule();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) schedule();
    else { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
  }, { rootMargin: '80px' });
  intersection.observe(container);
  if (!reducedMotion) {
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  document.addEventListener('visibilitychange', schedule);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    visible = false;
    container.classList.remove('is-ready');
    container.dataset.renderer = 'fallback';
  });
  onScroll();
  resize();
  renderer.render(scene, camera);
  container.classList.add('is-ready');
  container.dataset.renderer = 'webgl';
  schedule();
}
