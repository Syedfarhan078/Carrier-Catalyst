import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CareerCube3D.jsx — Interactive 3D career selection cube
 * Performance optimized:
 * - Capped pixel ratio (1.5)
 * - No shadow maps
 * - Proper animation frame cleanup
 * - Low-power GPU preference
 * - IntersectionObserver for offscreen pausing
 * - Reduced canvas texture resolution (256×256)
 * Premium enhancements:
 * - Smooth momentum-based auto-rotation
 * - Glowing edge lines on selected face
 * - Smoother easing on mouse rotation
 * - Pulsing emissive on selected face
 */

const CareerCube3D = ({ careers = [], onSelect, selectedIndex = 0 }) => {
  const containerRef = useRef(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || careers.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // ── SCENE ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.08);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0a0a14, 0.1);
    // No shadow maps

    // Remove existing canvas
    const existing = container.querySelector("canvas");
    if (existing) existing.remove();
    container.appendChild(renderer.domElement);

    // ── LIGHTING ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x6366f1, 0.7);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const backLight = new THREE.PointLight(0x8b5cf6, 0.4);
    backLight.position.set(-5, -5, 5);
    scene.add(backLight);

    // ── CUBE FACES WITH CAREERS ──
    const group = new THREE.Group();
    const cubeSize = 1.5;
    const positions = [
      { pos: [0, 0, cubeSize / 2], rot: [0, 0, 0] },
      { pos: [0, 0, -cubeSize / 2], rot: [0, Math.PI, 0] },
      { pos: [cubeSize / 2, 0, 0], rot: [0, Math.PI / 2, 0] },
      { pos: [-cubeSize / 2, 0, 0], rot: [0, -Math.PI / 2, 0] },
      { pos: [0, cubeSize / 2, 0], rot: [-Math.PI / 2, 0, 0] },
      { pos: [0, -cubeSize / 2, 0], rot: [Math.PI / 2, 0, 0] },
    ];

    const faceMeshes = [];
    const textures = [];

    careers.slice(0, 6).forEach((career, index) => {
      // ── CREATE CANVAS TEXTURE (reduced to 256×256) ──
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 256, 256);
      gradient.addColorStop(0, "#1a1f3a");
      gradient.addColorStop(1, "#0f0f1e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      // Border
      ctx.strokeStyle = index === selectedIndex ? "#818cf8" : "#4338ca";
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, 244, 244);

      // Icon (emoji or text)
      ctx.font = "bold 100px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#818cf8";
      ctx.fillText(career.iconText || "💼", 128, 80);

      // Label
      ctx.font = "bold 26px Arial";
      ctx.fillStyle = "#f1f5f9";
      const label = career.label.split(" ")[0];
      ctx.fillText(label, 128, 190);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      textures.push(texture);

      const geometry = new THREE.PlaneGeometry(cubeSize, cubeSize);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        emissive: index === selectedIndex ? 0x6366f1 : 0x000000,
        emissiveIntensity: index === selectedIndex ? 0.4 : 0,
        metalness: 0.3,
        roughness: 0.7,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...positions[index].pos);
      mesh.rotation.set(...positions[index].rot);
      mesh.userData = { careerIndex: index, texture, canvas };

      group.add(mesh);
      faceMeshes.push(mesh);
    });

    scene.add(group);

    // ── EDGE GLOW LINES ──
    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize));
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.3,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    group.add(edges);

    // ── MOUSE INTERACTION ──
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      targetRotationRef.current.x = mouse.y * 0.4;
      targetRotationRef.current.y = mouse.x * 0.4;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(faceMeshes);

      if (intersects.length > 0) {
        const careerIndex = intersects[0].object.userData.careerIndex;
        onSelect && onSelect(careerIndex);
      }
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("click", handleClick);

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
    let autoRotateY = 0;

    const animate = () => {
      if (!isVisible) {
        animationId = null;
        return;
      }
      animationId = requestAnimationFrame(animate);
      time += 0.016;

      // Smooth mouse-driven rotation
      group.rotation.x += (targetRotationRef.current.x - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotationRef.current.y - group.rotation.y) * 0.05;

      // Gentle auto-rotation
      autoRotateY += 0.003;
      group.rotation.y += Math.sin(autoRotateY) * 0.001;

      // Update emissive for selected career with pulse
      const pulse = 0.3 + Math.sin(time * 2) * 0.15;
      faceMeshes.forEach((mesh, index) => {
        const isSelected = index === selectedIndex;
        mesh.material.emissive.setHex(isSelected ? 0x6366f1 : 0x000000);
        mesh.material.emissiveIntensity = isSelected ? pulse : 0;
        const s = isSelected ? 1.03 : 1;
        mesh.scale.set(s, s, 1);
      });

      // Animate edge glow
      edgeMat.opacity = 0.2 + Math.sin(time * 1.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // ── CLEANUP ──
    return () => {
      observer.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      if (animationId) cancelAnimationFrame(animationId);
      renderer.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      faceMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh.userData.texture.dispose();
        mesh.userData.canvas.remove();
      });
    };
  }, [careers, selectedIndex, onSelect]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        cursor: "grab",
      }}
    />
  );
};

export default CareerCube3D;
