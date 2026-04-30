import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ShaderGradientMesh — Flowing gradient mesh background with custom GLSL
 *
 * Features:
 * - Full-screen quad with a custom fragment shader
 * - Animated 2D Simplex noise for organic gradient flow
 * - Mouse-reactive gradient center shift
 * - Color palette uniforms for easy theming
 * - IntersectionObserver for offscreen pause
 */

const NOISE_2D_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+10.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                           dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz  + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
${NOISE_2D_GLSL}

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uSpeed;
uniform float uScale;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Aspect-corrected coordinates
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 st = uv * aspect;
  
  // Mouse influence — shifts gradient center
  vec2 mouseShift = uMouse * 0.15;
  st += mouseShift;
  
  // Multi-octave noise for organic flow
  float t = uTime * uSpeed;
  float n1 = snoise(st * uScale + t * 0.3);
  float n2 = snoise(st * uScale * 1.5 + t * 0.2 + 3.14);
  float n3 = snoise(st * uScale * 2.5 + t * 0.15 + 6.28);
  
  // Combine noise layers with different weights
  float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  
  // Radial gradient from center for vignette depth
  float radial = length(uv - 0.5) * 1.4;
  
  // 4-color gradient mixing driven by noise
  float mix1 = smoothstep(-0.4, 0.4, noise + sin(t * 0.1) * 0.2);
  float mix2 = smoothstep(-0.2, 0.6, noise - cos(t * 0.15) * 0.2);
  
  vec3 colorA = mix(uColor1, uColor2, mix1);
  vec3 colorB = mix(uColor3, uColor4, mix2);
  vec3 finalColor = mix(colorA, colorB, smoothstep(0.0, 1.0, uv.y + noise * 0.3));
  
  // Vignette darken towards edges
  finalColor *= 1.0 - radial * 0.5;
  
  // Very subtle grain for premium feel
  float grain = fract(sin(dot(uv * uResolution, vec2(12.9898, 78.233))) * 43758.5453);
  finalColor += (grain - 0.5) * 0.015;
  
  // Overall opacity — keep it subtle as background
  float alpha = 0.35 - radial * 0.15;
  
  gl_FragColor = vec4(finalColor, alpha);
}
`;

const ShaderGradientMesh = ({
  color1 = "#0a0a2e",
  color2 = "#1a0a3e",
  color3 = "#0a1a3e",
  color4 = "#1a0a2e",
  speed = 0.4,
  scale = 2.0,
}) => {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    // ── Scene (fullscreen quad) ──
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const existing = container.querySelector("canvas");
    if (existing) existing.remove();
    container.appendChild(renderer.domElement);

    // ── Shader Material ──
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
      uColor4: { value: new THREE.Color(color4) },
      uSpeed: { value: speed },
      uScale: { value: scale },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
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
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      uniforms.uResolution.value.set(w, h);
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

    // ── Animate ──
    const animate = () => {
      if (!isVisible) { animationId = null; return; }
      animationId = requestAnimationFrame(animate);

      uniforms.uTime.value += 0.016;
      uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.03;
      uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.03;

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
  }, [color1, color2, color3, color4, speed, scale]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default ShaderGradientMesh;
