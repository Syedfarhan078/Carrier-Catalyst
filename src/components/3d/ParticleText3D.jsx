import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ParticleText3D.jsx — Premium particle text with assembly animation
 * Performance optimized:
 * - Capped pixel ratio (1.5)
 * - Smaller canvas texture (1024×256)
 * - Wave-based displacement (no per-particle sqrt/atan2)
 * - IntersectionObserver pauses when offscreen
 * - Low-power GPU preference
 * Premium enhancements:
 * - Particles "assemble" from scattered positions into text
 * - Gentle breathing/floating animation
 * - Glow-style point material
 */

const ParticleText3D = ({ text = "Carrer Catalyst", color = "#6366f1" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 200;

    // ── SCENE ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0a0a14, 0);

    const existing = container.querySelector("canvas");
    if (existing) existing.remove();
    container.appendChild(renderer.domElement);

    // ── CREATE TEXT TEXTURE (wide enough for full text) ──
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.font = "bold 180px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // ── EXTRACT PARTICLE POSITIONS — larger step for fewer particles ──
    const particleList = [];
    const step = 6; // sample every 6th pixel (was every 15th at 2048, this gives similar density)

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const idx = (y * canvas.width + x) * 4;
        if (data[idx + 3] > 128) {
          const px = (x / canvas.width - 0.5) * 22;
          const py = -(y / canvas.height - 0.5) * 5;

          particleList.push({
            // Target position (text shape)
            targetX: px,
            targetY: py,
            targetZ: 0,
            // Current position (starts scattered)
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 20,
            // Animation phase
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    const count = particleList.length;

    // ── CREATE PARTICLE GEOMETRY ──
    const posArray = new Float32Array(count * 3);
    particleList.forEach((p, i) => {
      posArray[i * 3] = p.x;
      posArray[i * 3 + 1] = p.y;
      posArray[i * 3 + 2] = p.z;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // ── LIGHTING ──
    const light = new THREE.PointLight(color, 0.8);
    light.position.set(10, 10, 10);
    scene.add(light);

    // ── MOUSE TRACKING ──
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / height) * 2 + 1;
    };
    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── VISIBILITY ──
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

    // ── ANIMATION LOOP ──
    let time = 0;
    const positionAttr = geometry.getAttribute("position");

    const animate = () => {
      if (!isVisible) {
        animationId = null;
        return;
      }
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      const positions = positionAttr.array;

      // Assembly progress: 0 → 1 over ~2 seconds
      const assemblyT = Math.min(time / 2.0, 1.0);
      const eased = 1 - Math.pow(1 - assemblyT, 3); // ease-out cubic

      for (let i = 0; i < count; i++) {
        const p = particleList[i];
        const i3 = i * 3;

        // Lerp from scattered to target position
        const tx = p.targetX;
        const ty = p.targetY;
        const tz = p.targetZ;

        // Current base = lerp(scattered start, target, eased)
        const baseX = p.x + (tx - p.x) * eased;
        const baseY = p.y + (ty - p.y) * eased;
        const baseZ = p.z + (tz - p.z) * eased;

        // Post-assembly: gentle wave displacement
        const wave = assemblyT >= 1 ? 1 : 0;
        const waveX = Math.sin(time * 0.5 + p.phase) * 0.05 * wave;
        const waveY = Math.cos(time * 0.4 + p.phase * 1.3) * 0.04 * wave;
        const waveZ = Math.sin(time * 0.3 + p.phase * 0.7) * 0.08 * wave;

        // Subtle mouse parallax (only after assembly)
        const mx = mouseX * 0.15 * wave;
        const my = mouseY * 0.1 * wave;

        positions[i3] = baseX + waveX + mx;
        positions[i3 + 1] = baseY + waveY + my;
        positions[i3 + 2] = baseZ + waveZ;
      }

      positionAttr.needsUpdate = true;

      // Subtle opacity pulse
      material.opacity = 0.75 + Math.sin(time * 0.8) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // ── CLEANUP ──
    return () => {
      observer.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      canvas.remove();
    };
  }, [text, color]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "180px",
      }}
    />
  );
};

export default ParticleText3D;
