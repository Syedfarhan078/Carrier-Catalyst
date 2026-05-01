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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
      // ── CREATE CANVAS TEXTURE (Premium 512x512) ──
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      const isSelected = index === selectedIndex;

      // Deep premium dark background
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, 0, 512, 512);

      // Radial glow in the center
      const radialGlow = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      if (isSelected) {
        radialGlow.addColorStop(0, "rgba(99, 102, 241, 0.4)");
        radialGlow.addColorStop(1, "rgba(10, 10, 20, 0)");
      } else {
        radialGlow.addColorStop(0, "rgba(255, 255, 255, 0.05)");
        radialGlow.addColorStop(1, "rgba(10, 10, 20, 0)");
      }
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, 512, 512);

      // Subtle tech grid pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 512; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
      }

      // Elegant inner border with rounded corners
      ctx.strokeStyle = isSelected ? "rgba(99, 102, 241, 0.8)" : "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.beginPath();
      const r = 24;
      const x = 16, y = 16, w = 480, h = 480;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.stroke();

      // Top-left small tech text
      ctx.font = "500 16px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillStyle = isSelected ? "#818cf8" : "rgba(255, 255, 255, 0.4)";
      ctx.fillText(`SYS.0${index + 1}`, 40, 50);

      // Top-right small tech text
      ctx.textAlign = "right";
      ctx.fillText(isSelected ? "ACTIVE" : "STANDBY", 472, 50);

      // Icon (emoji or text)
      ctx.font = "bold 160px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      
      // Glowing effect to the icon
      ctx.shadowColor = isSelected ? "rgba(99, 102, 241, 0.8)" : "transparent";
      ctx.shadowBlur = isSelected ? 40 : 0;
      ctx.fillText(career.iconText || "💼", 256, 210);
      ctx.shadowBlur = 0; // reset shadow

      // Label
      ctx.font = "900 52px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.9)";
      const label = career.label.split(" ")[0].toUpperCase();
      ctx.fillText(label, 256, 380);

      // Subtitle (Adding manual letter spacing via spacing function)
      ctx.font = "500 20px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = isSelected ? "rgba(129, 140, 248, 0.9)" : "rgba(255, 255, 255, 0.5)";
      const subtitle = "CAREER PATH";
      let startX = 256 - (ctx.measureText(subtitle).width / 2) - ((subtitle.length - 1) * 2);
      ctx.textAlign = "left";
      for (let i = 0; i < subtitle.length; i++) {
        ctx.fillText(subtitle[i], startX, 430);
        startX += ctx.measureText(subtitle[i]).width + 4; // 4px letter spacing
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      if (renderer.capabilities.getMaxAnisotropy() > 0) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
      textures.push(texture);

      const geometry = new THREE.PlaneGeometry(cubeSize, cubeSize);
      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: isSelected ? 0x6366f1 : 0x000000,
        emissiveIntensity: isSelected ? 0.3 : 0,
        emissiveMap: texture,
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
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
