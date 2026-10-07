import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function architecturalFrame() {
  const outer = new THREE.Shape();
  outer.moveTo(-1.36, -2.02);
  outer.lineTo(0.60, -2.02);
  outer.lineTo(1.39, -1.26);
  outer.lineTo(1.39, 1.26);
  outer.lineTo(0.60, 2.02);
  outer.lineTo(-1.36, 2.02);
  outer.closePath();
  const aperture = new THREE.Path();
  aperture.moveTo(-0.78, -1.43);
  aperture.lineTo(-0.78, 1.43);
  aperture.lineTo(0.35, 1.43);
  aperture.lineTo(0.82, 0.95);
  aperture.lineTo(0.82, -0.95);
  aperture.lineTo(0.35, -1.43);
  aperture.closePath();
  outer.holes.push(aperture);
  return outer;
}

export function createHeroScene(host: HTMLElement, reducedMotion: boolean) {
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const renderer = new THREE.WebGLRenderer({
    alpha: true, antialias: !mobile, powerPreference: "low-power", stencil: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
  const environmentRoom = new RoomEnvironment();
  // RoomEnvironment supplies broad studio softboxes, making the metal read as
  // a sculptural solid instead of relying on bright neon or particle effects.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentRoom, 0.045);
  scene.environment = environment.texture;
  scene.environmentIntensity = 1.12;
  environmentRoom.dispose();
  pmrem.dispose();

  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const face = new THREE.MeshPhysicalMaterial({
    color: 0x777b83, metalness: 1, roughness: 0.225,
    clearcoat: 0.32, clearcoatRoughness: 0.20, envMapIntensity: 1.25,
  });
  const cutEdges = new THREE.MeshPhysicalMaterial({
    color: 0x292d35, metalness: 1, roughness: 0.16,
    clearcoat: 0.38, clearcoatRoughness: 0.18, envMapIntensity: 1.55,
  });
  materials.push(face, cutEdges);
  const bodyGeometry = new THREE.ExtrudeGeometry(architecturalFrame(), {
    depth: 0.57, bevelEnabled: true, bevelSegments: mobile ? 3 : 5,
    steps: 1, bevelSize: 0.085, bevelThickness: 0.085, curveSegments: 1,
  });
  bodyGeometry.translate(0, 0, -0.285);
  geometries.push(bodyGeometry);
  const body = new THREE.Mesh(bodyGeometry, [face, cutEdges]);
  sculpture.add(body);

  // A restrained deep-blue glass inset on one inner edge. The broad exterior
  // remains neutral titanium and its open center remains completely clear.
  const glassGeometry = new THREE.BoxGeometry(0.045, 1.77, 0.29);
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0b48a5, metalness: 0.35, roughness: 0.15,
    transparent: true, opacity: 0.8, transmission: mobile ? 0 : 0.28,
    thickness: 0.17, ior: 1.46, emissive: 0x032875, emissiveIntensity: 0.38,
  });
  geometries.push(glassGeometry);
  materials.push(glass);
  const inset = new THREE.Mesh(glassGeometry, glass);
  inset.position.set(0.783, 0, -0.015);
  sculpture.add(inset);

  const backPlateGeometry = new THREE.ExtrudeGeometry(architecturalFrame(), {
    depth: 0.025, bevelEnabled: true, bevelSegments: 2,
    steps: 1, bevelSize: 0.046, bevelThickness: 0.015, curveSegments: 1,
  });
  backPlateGeometry.translate(0, 0, -0.405);
  const backMaterial = new THREE.MeshStandardMaterial({
    color: 0x090e18, metalness: 0.93, roughness: 0.26,
  });
  geometries.push(backPlateGeometry);
  materials.push(backMaterial);
  sculpture.add(new THREE.Mesh(backPlateGeometry, backMaterial));

  const keyLight = new THREE.DirectionalLight(0xeaf0ff, 3.6);
  keyLight.position.set(-3, 5, 5);
  const rimLight = new THREE.DirectionalLight(0x245de6, 1.6);
  rimLight.position.set(4, 1, -2);
  const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
  fillLight.position.set(2, -3, 4);
  scene.add(keyLight, rimLight, fillLight, new THREE.AmbientLight(0xd9e2f4, 0.12));

  let disposed = false;
  let active = true;
  let frame = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let lastTime = 0;
  const lookAt = new THREE.Vector3();

  const draw = (timestamp: number) => {
    frame = 0;
    if (disposed || !active) return;
    const elapsed = Math.min((timestamp - lastTime) / 1000 || 0.016, 0.064);
    lastTime = timestamp;
    const easing = 1 - Math.exp(-elapsed * 6.5);
    currentProgress += (targetProgress - currentProgress) * easing;
    pointerX += (targetX - pointerX) * easing;
    pointerY += (targetY - pointerY) * easing;
    const p = reducedMotion ? 0 : currentProgress;
    const px = reducedMotion ? 0 : pointerX;
    const py = reducedMotion ? 0 : pointerY;
    sculpture.rotation.set(0.1 + p * 0.21 + py * 0.028, -0.48 + p * 0.96 + px * 0.052, -0.22 + p * 0.23);
    sculpture.position.set(-0.05 + p * 0.46, 0.08 + p * 0.13, p * 0.58);
    camera.position.set(0.25 - p * 0.54 + px * 0.1, 0.38 + p * 0.18 - py * 0.1, (mobile ? 9.6 : 8.75) - p * 3.65);
    lookAt.set(0.03 + p * 0.12, 0.08, 0);
    camera.lookAt(lookAt);
    renderer.render(scene, camera);
    const moving = Math.abs(targetProgress - currentProgress) + Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > 0.00035;
    if (!reducedMotion && moving) frame = window.requestAnimationFrame(draw);
  };

  const invalidate = () => {
    if (!disposed && active && !frame) frame = window.requestAnimationFrame(draw);
  };
  const resize = () => {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    invalidate();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    active = false;
    host.dataset.renderer = "fallback";
    const fallback = host.querySelector<HTMLElement>(".sculpture-fallback");
    if (fallback) fallback.style.opacity = "1";
  };
  const onContextRestored = () => {
    active = !document.hidden;
    host.dataset.renderer = "webgl";
    const fallback = host.querySelector<HTMLElement>(".sculpture-fallback");
    if (fallback) fallback.style.opacity = "0";
    resize();
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);
  host.appendChild(renderer.domElement);
  resize();

  return {
    setProgress(value: number) {
      if (reducedMotion) return;
      targetProgress = clamp(value);
      invalidate();
    },
    setPointer(x: number, y: number) {
      if (reducedMotion || mobile) return;
      targetX = Math.max(-1, Math.min(1, x));
      targetY = Math.max(-1, Math.min(1, y));
      invalidate();
    },
    setActive(value: boolean) {
      active = value;
      if (active) invalidate();
      else if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    },
    resize,
    dispose() {
      disposed = true;
      window.cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      environment.dispose();
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
