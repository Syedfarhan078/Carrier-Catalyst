import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ShaderOrb — Advanced WebGL iridescent orb with custom GLSL shaders
 * 
 * Features:
 * - Custom vertex shader with 3D Simplex noise displacement
 * - Fragment shader with Fresnel iridescence + chromatic color shifts
 * - Mouse-reactive distortion
 * - Scroll-linked morphing intensity
 * - IntersectionObserver for offscreen pause
 * - Capped pixel ratio for performance
 */

// ── GLSL: 3D Simplex Noise (Ashima Arts) ──
const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// ── Vertex Shader ──
const vertexShader = `
${NOISE_GLSL}

uniform float uTime;
uniform float uNoiseIntensity;
uniform float uNoiseScale;
uniform vec2 uMouse;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  // Layered noise displacement
  float noise1 = snoise(position * uNoiseScale + uTime * 0.3) * 0.5;
  float noise2 = snoise(position * uNoiseScale * 2.0 + uTime * 0.5) * 0.25;
  float noise3 = snoise(position * uNoiseScale * 4.0 + uTime * 0.7) * 0.125;
  
  float totalNoise = (noise1 + noise2 + noise3) * uNoiseIntensity;
  
  // Mouse influence on displacement
  float mouseInfluence = 1.0 + length(uMouse) * 0.3;
  totalNoise *= mouseInfluence;
  
  // Displace along normal
  vec3 newPosition = position + normal * totalNoise;
  
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
  vDisplacement = totalNoise;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

// ── Fragment Shader ──
const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uFresnelPower;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  // View direction for Fresnel
  vec3 viewDir = normalize(-vPosition);
  
  // Fresnel effect — edge glow
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uFresnelPower);
  
  // Iridescent color mixing based on displacement + time
  float colorMix = vDisplacement * 3.0 + uTime * 0.15;
  vec3 color1 = mix(uColor1, uColor2, sin(colorMix) * 0.5 + 0.5);
  vec3 color2 = mix(uColor2, uColor3, cos(colorMix * 1.3) * 0.5 + 0.5);
  vec3 baseColor = mix(color1, color2, fresnel);
  
  // Add glow at edges
  vec3 glowColor = uColor1 * 1.5;
  baseColor += glowColor * fresnel * 0.4;
  
  // Subtle inner darkening for depth
  float innerDark = 1.0 - fresnel * 0.3;
  baseColor *= innerDark;
  
  // Alpha: solid center, glowing edges
  float alpha = 0.7 + fresnel * 0.3;
  
  gl_FragColor = vec4(baseColor, alpha);
}
`;

const ShaderOrb = ({
  size = 2.2,
  color1 = "#6366f1",
  color2 = "#a78bfa",
  color3 = "#06b6d4",
  noiseScale = 1.2,
  noiseIntensity = 0.35,
  fresnelPower = 2.5,
  rotationSpeed = 0.15,
}) => {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    // ── Scene Setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const existing = container.querySelector("canvas");
    if (existing) existing.remove();
    container.appendChild(renderer.domElement);

    // ── Shader Material ──
    const uniforms = {
      uTime: { value: 0 },
      uNoiseScale: { value: noiseScale },
      uNoiseIntensity: { value: noiseIntensity },
      uFresnelPower: { value: fresnelPower },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    // High-detail sphere for smooth noise displacement
    const geometry = new THREE.IcosahedronGeometry(size, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Mouse Tracking ──
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── Resize ──
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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

    // ── Animation ──
    const animate = () => {
      if (!isVisible) { animationId = null; return; }
      animationId = requestAnimationFrame(animate);

      uniforms.uTime.value += 0.016;

      // Smooth mouse follow
      uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.05;

      // Gentle auto-rotation
      mesh.rotation.y += rotationSpeed * 0.01;
      mesh.rotation.x += rotationSpeed * 0.005;

      // Mouse-driven rotation offset
      mesh.rotation.y += (mouseX - mesh.rotation.y * 0.1) * 0.002;
      mesh.rotation.x += (mouseY - mesh.rotation.x * 0.1) * 0.002;

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
  }, [size, color1, color2, color3, noiseScale, noiseIntensity, fresnelPower, rotationSpeed]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default ShaderOrb;
