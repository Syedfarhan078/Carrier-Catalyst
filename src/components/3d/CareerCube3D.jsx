import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CareerCube3D.jsx — Interactive 3D career showcase carousel
 * Premium enhancements:
 * - 3D Carousel instead of a simple cube, supporting any number of careers
 * - Custom 3D wireframe models (TorusKnot, Sphere, Octahedron, Torus) for each track
 * - Continuous smooth rotation so all careers are visible
 * - Interactive hover states and glowing emissives
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
    camera.position.z = 3.2; // Pulled back slightly for carousel view
    camera.position.y = 0.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a14, 0.1);

    const existing = container.querySelector("canvas");
    if (existing) existing.remove();
    container.appendChild(renderer.domElement);

    // ── LIGHTING ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x6366f1, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const backLight = new THREE.PointLight(0x8b5cf6, 0.6);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // ── CAROUSEL GROUP ──
    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    const faceMeshes = [];
    const objMeshes = [];
    const textures = [];

    const radius = 1.4; // Distance from center
    const cardSize = 1.6;

    careers.forEach((career, index) => {
      const angle = (index / careers.length) * Math.PI * 2;
      
      const cardGroup = new THREE.Group();
      cardGroup.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
      cardGroup.rotation.set(0, angle, 0);
      carouselGroup.add(cardGroup);

      // ── CANVAS TEXTURE (Premium 512x512) ──
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      // Dark background
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, 0, 512, 512);

      // Radial glow in the center
      const radialGlow = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      radialGlow.addColorStop(0, "rgba(99, 102, 241, 0.2)");
      radialGlow.addColorStop(1, "rgba(10, 10, 20, 0)");
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
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
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
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText(`SYS.0${index + 1}`, 40, 50);

      // Top-right small tech text
      ctx.textAlign = "right";
      ctx.fillText("ACTIVE", 472, 50);

      // Label (Bottom)
      ctx.font = "900 48px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.textAlign = "center";
      
      // Handle longer labels
      let labelText = career.label.toUpperCase();
      if (labelText.includes("DEVELOPMENT")) labelText = "WEB DEV";
      if (labelText.includes("DEVOPS")) labelText = "DEVOPS";
      ctx.fillText(labelText, 256, 400);

      // Subtitle
      ctx.font = "500 18px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      const subtitle = "CAREER PATH";
      let startX = 256 - (ctx.measureText(subtitle).width / 2) - ((subtitle.length - 1) * 2);
      ctx.textAlign = "left";
      for (let i = 0; i < subtitle.length; i++) {
        ctx.fillText(subtitle[i], startX, 440);
        startX += ctx.measureText(subtitle[i]).width + 4; // 4px letter spacing
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      textures.push(texture);

      const geometry = new THREE.PlaneGeometry(cardSize, cardSize);
      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: 0x000000,
        emissiveIntensity: 0,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { careerIndex: index, texture, canvas };
      cardGroup.add(mesh);
      faceMeshes.push(mesh);

      // ── CUSTOM 3D OBJECT PER CAREER ──
      const objColor = career.color || "#6366f1";
      const objMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(objColor),
        emissive: new THREE.Color(objColor),
        emissiveIntensity: 0.4,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });

      let objGeo;
      if (index === 0) objGeo = new THREE.TorusKnotGeometry(0.35, 0.08, 64, 12); // Data Science
      else if (index === 1) objGeo = new THREE.SphereGeometry(0.4, 12, 12); // Web Dev
      else if (index === 2) objGeo = new THREE.OctahedronGeometry(0.4, 0); // Cyber
      else objGeo = new THREE.TorusGeometry(0.35, 0.15, 12, 24); // DevOps / Other

      const objMesh = new THREE.Mesh(objGeo, objMat);
      objMesh.position.set(0, 0.1, 0.2); // Hover slightly above center
      cardGroup.add(objMesh);
      objMeshes.push(objMesh);
      
      // Add a solid core to the wireframe
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(objColor),
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.2,
      });
      const coreMesh = new THREE.Mesh(objGeo, coreMat);
      coreMesh.scale.set(0.9, 0.9, 0.9);
      objMesh.add(coreMesh);
    });

    // ── MOUSE INTERACTION ──
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      targetRotationRef.current.x = mouse.y * 0.15;
      targetRotationRef.current.y = mouse.x * 0.5;
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

      // Continuous Carousel Rotation
      autoRotateY -= 0.005; // Rotate counter-clockwise slowly
      
      // Apply auto rotation + mouse parallax
      carouselGroup.rotation.y = autoRotateY + targetRotationRef.current.y;
      carouselGroup.rotation.x = targetRotationRef.current.x;

      // Animate Individual Objects
      objMeshes.forEach((mesh, idx) => {
        mesh.rotation.x += 0.008;
        mesh.rotation.y += 0.012;
        // Floating bob effect
        mesh.position.y = 0.1 + Math.sin(time * 2 + idx) * 0.05;
      });

      // Update emissive for hover / selection logic
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(faceMeshes);
      const hoveredIndex = intersects.length > 0 ? intersects[0].object.userData.careerIndex : -1;

      faceMeshes.forEach((mesh, index) => {
        const isHovered = index === hoveredIndex;
        const pulse = 0.2 + Math.sin(time * 3) * 0.1;
        
        if (isHovered) {
           mesh.material.emissive.setHex(0x6366f1);
           mesh.material.emissiveIntensity = pulse;
           container.style.cursor = "pointer";
        } else {
           mesh.material.emissive.setHex(0x000000);
           mesh.material.emissiveIntensity = 0;
        }
      });
      
      if (intersects.length === 0) container.style.cursor = "grab";

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
      faceMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh.userData.texture.dispose();
        mesh.userData.canvas.remove();
      });
      objMeshes.forEach((mesh) => {
         mesh.geometry.dispose();
         mesh.material.dispose();
         mesh.children.forEach(c => {
            c.geometry.dispose();
            c.material.dispose();
         });
      });
    };
  }, [careers, onSelect]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "450px",
      }}
    />
  );
};

export default CareerCube3D;
