import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AnimatedBackground.jsx — Premium 3D animated background
 * Performance optimized:
 * - Capped pixel ratio (1.5 max)
 * - No shadow maps
 * - Low-power GPU preference
 * - IntersectionObserver pauses when offscreen
 * - InstancedMesh for floating shapes (1 draw call instead of 5)
 * - Fog for premium depth
 */

const AnimatedBackground = ({ particleCount = 80 }) => {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    // ── SCENE SETUP ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.04); // depth fade

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,       // not needed for background
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0a0a14, 0.1);
    // No shadow maps needed
    container.appendChild(renderer.domElement);

    // ── LIGHTING ──
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 0.8);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.6);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // ── PARTICLES (BufferGeometry — single draw call) ──
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      velocities[i3] = (Math.random() - 0.5) * 0.012;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.012;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.012;

      sizes[i] = 0.08 + Math.random() * 0.12;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.15,
      sizeAttenuation: true,
      opacity: 0.5,
      transparent: true,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // ── FLOATING SHAPES — InstancedMesh (single draw call) ──
    const shapeCount = 4;
    const shapeGeo = new THREE.OctahedronGeometry(0.4, 0);
    const shapeMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4338ca,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    const instancedMesh = new THREE.InstancedMesh(shapeGeo, shapeMat, shapeCount);
    scene.add(instancedMesh);

    // Pre-compute shape data
    const shapeData = [];
    const dummy = new THREE.Object3D();
    for (let i = 0; i < shapeCount; i++) {
      shapeData.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 16,
        z: (Math.random() - 0.5) * 10 - 3,
        rotSpeed: 0.001 + Math.random() * 0.003,
        floatPhase: Math.random() * Math.PI * 2,
        scale: 0.6 + Math.random() * 0.8,
      });
    }

    // ── MOUSE TRACKING (throttled) ──
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / width) * 2 - 1;
      mouseY = -(e.clientY / height) * 2 + 1;
    };
    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── RESIZE ──
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── VISIBILITY-BASED RENDERING ──
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
    const animate = () => {
      if (!isVisible) {
        animationId = null;
        return;
      }
      animationId = requestAnimationFrame(animate);
      time += 0.008;

      // Update particles
      const pos = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        pos[i] += velocities[i];
        pos[i + 1] += velocities[i + 1];
        pos[i + 2] += velocities[i + 2];

        // Wrap around
        if (pos[i] > 15) pos[i] = -15;
        else if (pos[i] < -15) pos[i] = 15;
        if (pos[i + 1] > 15) pos[i + 1] = -15;
        else if (pos[i + 1] < -15) pos[i + 1] = 15;
        if (pos[i + 2] > 15) pos[i + 2] = -15;
        else if (pos[i + 2] < -15) pos[i + 2] = 15;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Subtle color shift on particles
      const hue = 0.64 + Math.sin(time * 0.3) * 0.03; // oscillate around indigo
      particleMaterial.color.setHSL(hue, 0.7, 0.65);

      // Update instanced shapes
      for (let i = 0; i < shapeCount; i++) {
        const s = shapeData[i];
        dummy.position.set(
          s.x + Math.sin(time + s.floatPhase) * 0.5,
          s.y + Math.cos(time * 0.7 + s.floatPhase) * 0.5,
          s.z
        );
        dummy.rotation.set(
          time * s.rotSpeed * 20,
          time * s.rotSpeed * 15,
          time * s.rotSpeed * 10
        );
        dummy.scale.setScalar(s.scale);

        // Gentle mouse parallax
        dummy.position.x += mouseX * 0.3;
        dummy.position.y += mouseY * 0.3;

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ── CLEANUP ──
    cleanupRef.current = () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      shapeGeo.dispose();
      shapeMat.dispose();
      instancedMesh.dispose();
    };

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default AnimatedBackground;
