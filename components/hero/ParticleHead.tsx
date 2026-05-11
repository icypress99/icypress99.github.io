'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 10000;

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMorphProgress;
  uniform float uScrollProgress;

  attribute vec3 aTargetPos;
  attribute float aSize;
  attribute float aPhase;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 pos = mix(position, aTargetPos, smoothstep(0.0, 1.0, uMorphProgress));

    // Organic oscillation
    float wave = sin(uTime * 1.2 + aPhase * 6.28) * 0.012;
    pos.x += wave * cos(aPhase * 3.14);
    pos.y += wave * sin(aPhase * 3.14);
    pos.z += sin(uTime * 0.8 + aPhase * 4.0) * 0.008;

    // Mouse interaction — repulsion field
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec2 screen = mvPos.xy / (-mvPos.z);
    vec2 toMouse = screen - uMouse * vec2(0.8, 0.5);
    float dist = length(toMouse);
    float repulse = smoothstep(0.25, 0.0, dist) * 0.18;
    pos.x += normalize(toMouse).x * repulse;
    pos.y += normalize(toMouse).y * repulse;

    vec4 finalMV = modelViewMatrix * vec4(pos, 1.0);
    float depth = -finalMV.z;

    float pointSize = aSize * (300.0 / depth);
    gl_PointSize = clamp(pointSize, 0.5, 4.0);
    gl_Position = projectionMatrix * finalMV;

    float depthFade = 1.0 - smoothstep(1.5, 3.5, depth);
    vAlpha = depthFade * (0.5 + 0.5 * sin(uTime * 1.5 + aPhase * 6.28));

    // Color based on position — gradient from mint to violet
    float colorT = (pos.y + 1.2) / 2.4;
    vec3 mintColor = vec3(0.302, 1.0, 0.706);
    vec3 violetColor = vec3(0.482, 0.38, 1.0);
    vColor = mix(violetColor, mintColor, colorT);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = (1.0 - dist * 2.0);
    alpha = pow(alpha, 1.5);

    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

function generateHeadPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = goldenAngle * i;

    let x = Math.sin(inclination) * Math.cos(azimuth);
    let y = Math.sin(inclination) * Math.sin(azimuth);
    let z = Math.cos(inclination);

    // Remap to head shape
    const yNorm = y; // -1 to 1

    // Cranium: slightly wide at top, narrowing to jaw
    const crownScale = 1.0 - Math.max(0, yNorm - 0.6) * 0.4;
    const jawScale = yNorm < -0.3
      ? 1.0 - (Math.abs(yNorm + 0.3) / 0.7) * 0.45
      : 1.0;
    const lateralScale = crownScale * jawScale;

    x *= lateralScale * 0.82;
    z *= lateralScale * 0.72;
    y *= 1.1;

    // Flat back of head
    if (z < -0.5) {
      z = -0.5 + (z + 0.5) * 0.4;
    }

    // Nose bump
    const noseAngle = Math.atan2(x, z);
    const noseFront = Math.max(0, z) * Math.max(0, 1 - Math.abs(noseAngle) * 3);
    const noseRegion = Math.max(0, 1 - Math.abs(y + 0.05) * 4) * noseFront;
    z += noseRegion * 0.22;

    // Eye socket depth
    const leftEyeX = -0.3, rightEyeX = 0.3, eyeY = 0.2;
    const eyeZ = 0.6;
    const leftEyeDist = Math.sqrt((x - leftEyeX) ** 2 + (y - eyeY) ** 2 + (z - eyeZ) ** 2);
    const rightEyeDist = Math.sqrt((x - rightEyeX) ** 2 + (y - eyeY) ** 2 + (z - eyeZ) ** 2);
    const eyeSocket = Math.max(0, 1 - Math.min(leftEyeDist, rightEyeDist) * 5) * 0.08;
    z -= eyeSocket;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

function generateSpherePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = goldenAngle * i;
    positions[i * 3] = Math.sin(inclination) * Math.cos(azimuth) * 1.2;
    positions[i * 3 + 1] = Math.sin(inclination) * Math.sin(azimuth) * 1.2;
    positions[i * 3 + 2] = Math.cos(inclination) * 1.2;
  }

  return positions;
}

function generateConstellationPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const spread = 3.0;

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.3;
  }

  return positions;
}

interface ParticleHeadProps {
  morphTarget?: 'head' | 'sphere' | 'constellation';
}

export default function ParticleHead({ morphTarget = 'head' }: ParticleHeadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    morphProgress: 0,
    targetMorph: 0,
    mouse: { x: 0, y: 0 },
    scrollY: 0,
  });

  const positions = useMemo(() => ({
    head: generateHeadPositions(PARTICLE_COUNT),
    sphere: generateSpherePositions(PARTICLE_COUNT),
    constellation: generateConstellationPositions(PARTICLE_COUNT),
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Scene + camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.5;

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const headPos = positions.head;
    const spherePos = positions.sphere;
    const constelPos = positions.constellation;

    geometry.setAttribute('position', new THREE.BufferAttribute(headPos.slice(), 3));
    geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(headPos.slice(), 3));

    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizes[i] = 1.5 + Math.random() * 2.5;
      phases[i] = Math.random();
    }
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMorphProgress: { value: 0 },
      uScrollProgress: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      stateRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      stateRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Scroll tracking
    const onScroll = () => {
      stateRef.current.scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Store current target positions for smooth morphing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentPositions: any = headPos.slice();
    let targetPositions: Float32Array = headPos.slice();
    let lastMorphTarget = morphTarget;

    let raf: number;
    let clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Detect morph target change
      if (morphTarget !== lastMorphTarget) {
        const targetMap: Record<string, Float32Array> = {
          head: positions.head,
          sphere: positions.sphere,
          constellation: positions.constellation,
        };
        currentPositions = (geometry.attributes.position as THREE.BufferAttribute).array;
        targetPositions = targetMap[morphTarget].slice();
        geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPositions.slice(), 3));
        geometry.attributes.aTargetPos.needsUpdate = true;
        stateRef.current.morphProgress = 0;
        stateRef.current.targetMorph = 1;
        lastMorphTarget = morphTarget;
      }

      // Ease morph progress
      stateRef.current.morphProgress += (stateRef.current.targetMorph - stateRef.current.morphProgress) * 0.03;
      uniforms.uMorphProgress.value = stateRef.current.morphProgress;

      // When morph completes, update base positions
      if (Math.abs(stateRef.current.morphProgress - stateRef.current.targetMorph) < 0.001) {
        if (stateRef.current.targetMorph === 1) {
          geometry.setAttribute('position', new THREE.BufferAttribute(targetPositions.slice(), 3));
          geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPositions.slice(), 3));
          geometry.attributes.position.needsUpdate = true;
          geometry.attributes.aTargetPos.needsUpdate = true;
          stateRef.current.morphProgress = 0;
          stateRef.current.targetMorph = 0;
        }
      }

      // Smooth mouse
      uniforms.uMouse.value.x += (stateRef.current.mouse.x - uniforms.uMouse.value.x) * 0.08;
      uniforms.uMouse.value.y += (stateRef.current.mouse.y - uniforms.uMouse.value.y) * 0.08;

      // Slow rotation
      particles.rotation.y = elapsed * 0.08 + stateRef.current.mouse.x * 0.15;
      particles.rotation.x = stateRef.current.mouse.y * 0.08;

      uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [positions]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ background: 'transparent' }}
    />
  );
}
