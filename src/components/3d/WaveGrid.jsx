import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * WaveGrid — WebGL animated wireframe grid with sine wave vertex displacement
 *
 * Features:
 * - Custom vertex shader with multi-wave displacement
 * - Fading edges via fragment shader distance calculation
 * - Mouse-reactive wave center
 * - IntersectionObserver for offscreen pause
 */

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;

varying float vElevation;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Distance from mouse position for interactive ripple
  float distFromMouse = length(pos.xz - uMouse * 5.0);
  float mouseWave = sin(distFromMouse * 2.0 - uTime * 3.0) * 0.15 * exp(-distFromMouse * 0.2);
  
  // Multi-frequency wave displacement
  float wave1 = sin(pos.x * uWaveFrequency + uTime * 0.8) * uWaveAmplitude;
  float wave2 = sin(pos.z * uWaveFrequency * 0.7 + uTime * 0.6) * uWaveAmplitude * 0.6;
  float wave3 = cos((pos.x + pos.z) * uWaveFrequency * 0.5 + uTime * 0.4) * uWaveAmplitude * 0.3;
  
  pos.y = wave1 + wave2 + wave3 + mouseWave;
  vElevation = pos.y;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform vec3 uHighColor;
uniform float uFadeDistance;

varying float vElevation;
varying vec2 vUv;

void main() {
  // Edge fade based on UV distance from center
  vec2 center = vUv - 0.5;
  float dist = length(center) * 2.0;
  float fade = 1.0 - smoothstep(0.5, uFadeDistance, dist);
  
  // Color based on elevation
  float colorMix = (vElevation + 0.5) * 1.2;
  vec3 color = mix(uColor, uHighColor, clamp(colorMix, 0.0, 1.0));
  
  // Overall alpha
  float alpha = fade * 0.35;
  
  gl_FragColor = vec4(color, alpha);
}
`;

const WaveGrid = ({
  color = "#6366f1",
  highColor = "#a78bfa",
  amplitude = 0.3,
  frequency = 0.8,
  segments = 80,
  gridSize = 16,
  height = 300,
}) => {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const h = container.clientHeight;
    if (width === 0 || h === 0) return;

    // ── Scene ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / h, 0.1, 100);
    camera.position.set(0, 4, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const existing = container.querySelector("canvas");
    if (existing) existing.remove();
    container.appendChild(renderer.domElement);

    // ── Shader Material ──
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color(color) },
      uHighColor: { value: new THREE.Color(highColor) },
      uWaveAmplitude: { value: amplitude },
      uWaveFrequency: { value: frequency },
      uFadeDistance: { value: 1.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      wireframe: true,
      side: THREE.DoubleSide,
    });

    const geometry = new THREE.PlaneGeometry(gridSize, gridSize, segments, segments);
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Mouse ──
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── Resize ──
    const handleResize = () => {
      const w = container.clientWidth;
      const ch = container.clientHeight;
      if (w === 0 || ch === 0) return;
      camera.aspect = w / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(w, ch);
    };
    window.addEventListener("resize", handleResize);

    // ── Visibility ──
    let isVisible = true;
    let animationId = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) animate();
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ── Animate ──
    const animate = () => {
      if (!isVisible) { animationId = null; return; }
      animationId = requestAnimationFrame(animate);

      uniforms.uTime.value += 0.016;
      uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    cleanupRef.current = () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };

    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, [color, highColor, amplitude, frequency, segments, gridSize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: `${height}px`,
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
};

export default WaveGrid;
