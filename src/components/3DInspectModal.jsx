import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { X, Sun, Moon, Sparkles, RefreshCw, Eye } from "lucide-react";
import { createJarMesh, createCanMesh, createTomatoMesh } from "./ThreeCanvas";

export default function Inspect3DModal({ product, onClose }) {
  const containerRef = useRef(null);
  const [lightPreset, setLightPreset] = useState("sunlight");
  const [isWireframe, setIsWireframe] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !product) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, lightPreset === "sunset" ? 0.8 : 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(
      lightPreset === "sunset" ? 0xffaa55 : lightPreset === "studio" ? 0xffffff : 0xfffaed,
      lightPreset === "studio" ? 3.0 : 2.2
    );
    dirLight1.position.set(4, 6, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe54b4b, 1.2);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    // Product Mesh Selection
    const group = new THREE.Group();
    let mainMesh;

    if (product.name.includes("Paste") || product.name.includes("Canned")) {
      mainMesh = createCanMesh({ radius: 1.0, height: 2.0, labelTitle: "INDUS FOOD", labelSubtitle: product.name });
    } else if (product.name.includes("Puree") || product.name.includes("Ketchup") || product.name.includes("Sauce")) {
      let fillColor = 0xb82315;
      if (product.tone === "gold") fillColor = 0xcc4411;
      mainMesh = createJarMesh({ width: 1.15, height: 2.0, fillColor, labelTitle: "INDUS FOOD", labelSubtitle: product.name });
    } else {
      mainMesh = createTomatoMesh({ radius: 1.4, color: 0xd9381e });
    }

    group.add(mainMesh);
    scene.add(group);

    // Toggle Wireframe
    if (isWireframe) {
      mainMesh.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = true;
        }
      });
    }

    // 360° Drag & Touch Rotation Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        group.rotation.y += 0.005; // Slow gentle auto-spin
      }

      group.position.y = Math.sin(elapsedTime * 1.5) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product, lightPreset, isWireframe]);

  if (!product) return null;

  return (
    <div className="inspect-3d-backdrop" onClick={onClose}>
      <div className="inspect-3d-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inspect-header">
          <div>
            <span className="inspect-badge">360° 3D PRODUCT INSPECTOR</span>
            <h2>{product.name}</h2>
          </div>
          <button className="inspect-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="inspect-canvas-wrap" ref={containerRef}>
          <div className="inspect-hint">
            <RefreshCw size={14} className="spin-icon" /> Drag to rotate 360° in 3D space
          </div>
        </div>

        <div className="inspect-toolbar">
          <div className="toolbar-group">
            <span className="toolbar-label">Lighting Preset:</span>
            <button
              className={`toolbar-btn ${lightPreset === "sunlight" ? "active" : ""}`}
              onClick={() => setLightPreset("sunlight")}
            >
              <Sun size={15} /> Harvest Sun
            </button>
            <button
              className={`toolbar-btn ${lightPreset === "studio" ? "active" : ""}`}
              onClick={() => setLightPreset("studio")}
            >
              <Sparkles size={15} /> Studio Bright
            </button>
            <button
              className={`toolbar-btn ${lightPreset === "sunset" ? "active" : ""}`}
              onClick={() => setLightPreset("sunset")}
            >
              <Moon size={15} /> Sunset Warmth
            </button>
          </div>

          <button
            className={`toolbar-btn ${isWireframe ? "active" : ""}`}
            onClick={() => setIsWireframe(!isWireframe)}
          >
            <Eye size={15} /> Wireframe View
          </button>
        </div>
      </div>
    </div>
  );
}
