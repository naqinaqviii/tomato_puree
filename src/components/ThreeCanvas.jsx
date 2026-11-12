import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ==========================================
   PROCEDURAL 3D TEXTURES & MATERIALS HELPERS
   ========================================== */

function createLabelTexture(title, subtitle, bgColor = "#FDFBF7", textColor = "#8B1E0F") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  try {
    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    ctx.strokeStyle = "#D4AF37"; // Gold inner border
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Top emblem icon
    ctx.fillStyle = textColor;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 60, 16, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.fillStyle = textColor;
    ctx.font = "bold 34px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 120);

    // Subtitle
    ctx.fillStyle = "#555555";
    ctx.font = "italic 20px sans-serif";
    ctx.fillText(subtitle, canvas.width / 2, 155);

    // Stamp / Details
    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("★ 100% ORGANIC VINE RIPENED ★", canvas.width / 2, 195);
    ctx.fillText("NET WT. 800g / 28 oz", canvas.width / 2, 220);
  } catch (err) {
    console.warn("Label texture generation warning:", err);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/* ==========================================
   PROCEDURAL 3D MESH GENERATORS
   ========================================== */

export function createTomatoMesh({ radius = 1, color = 0xd9381e, detail = 32 } = {}) {
  const group = new THREE.Group();

  // Organic Tomato Body geometry
  const geom = new THREE.SphereGeometry(radius, detail, detail);
  const posAttr = geom.attributes.position;
  
  for (let i = 0; i < posAttr.count; i++) {
    let x = posAttr.getX(i);
    let y = posAttr.getY(i);
    let z = posAttr.getZ(i);

    y *= 0.88;
    const angle = Math.atan2(z, x);
    const radiusMod = 1 + Math.sin(angle * 5) * 0.04;
    x *= radiusMod;
    z *= radiusMod;

    posAttr.setXYZ(i, x, y, z);
  }
  geom.computeVertexNormals();

  const tomatoMaterial = new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.18,
    metalness: 0.02,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
    transmission: 0.05,
    thickness: 0.4,
    ior: 1.4,
  });

  const body = new THREE.Mesh(geom, tomatoMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Calyx
  const calyxGroup = new THREE.Group();
  calyxGroup.position.y = radius * 0.82;

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d6e35,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });

  const numSepals = 6;
  for (let i = 0; i < numSepals; i++) {
    const angle = (i / numSepals) * Math.PI * 2;
    const sepalGeom = new THREE.ConeGeometry(radius * 0.15, radius * 0.5, 4);
    sepalGeom.rotateX(Math.PI / 2.2);
    const sepal = new THREE.Mesh(sepalGeom, leafMaterial);
    sepal.rotation.y = angle;
    sepal.position.x = Math.cos(angle) * (radius * 0.18);
    sepal.position.z = Math.sin(angle) * (radius * 0.18);
    calyxGroup.add(sepal);
  }

  // Stem
  const stemGeom = new THREE.CylinderGeometry(radius * 0.04, radius * 0.05, radius * 0.35, 8);
  stemGeom.translate(0, radius * 0.15, 0);
  stemGeom.rotateZ(-0.2);
  const stem = new THREE.Mesh(stemGeom, leafMaterial);
  calyxGroup.add(stem);

  group.add(calyxGroup);
  return group;
}

export function createJarMesh({
  width = 1.2,
  height = 2.0,
  fillColor = 0xb82315,
  labelTitle = "INDUS FOOD",
  labelSubtitle = "Puree De Tomate",
} = {}) {
  const group = new THREE.Group();

  // Glass Body
  const glassGeom = new THREE.CylinderGeometry(width * 0.85, width * 0.85, height, 32);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    transmission: 0.92,
    roughness: 0.05,
    ior: 1.5,
    thickness: 0.6,
  });
  const glassBody = new THREE.Mesh(glassGeom, glassMaterial);
  glassBody.castShadow = true;
  group.add(glassBody);

  // Puree Interior
  const pureeGeom = new THREE.CylinderGeometry(width * 0.81, width * 0.81, height * 0.82, 32);
  pureeGeom.translate(0, -height * 0.06, 0);
  const pureeMaterial = new THREE.MeshStandardMaterial({
    color: fillColor,
    roughness: 0.45,
    metalness: 0.05,
  });
  const puree = new THREE.Mesh(pureeGeom, pureeMaterial);
  group.add(puree);

  // Lid
  const lidGeom = new THREE.CylinderGeometry(width * 0.88, width * 0.88, height * 0.12, 32);
  lidGeom.translate(0, height * 0.52, 0);
  const lidMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.85,
    roughness: 0.22,
  });
  const lid = new THREE.Mesh(lidGeom, lidMaterial);
  lid.castShadow = true;
  group.add(lid);

  // Label
  const labelGeom = new THREE.CylinderGeometry(width * 0.86, width * 0.86, height * 0.45, 32, 1, true, -Math.PI * 0.7, Math.PI * 1.4);
  const labelTex = createLabelTexture(labelTitle, labelSubtitle);
  const labelMaterial = new THREE.MeshStandardMaterial({
    map: labelTex,
    roughness: 0.6,
    side: THREE.DoubleSide,
  });
  const label = new THREE.Mesh(labelGeom, labelMaterial);
  group.add(label);

  return group;
}

export function createCanMesh({
  radius = 0.9,
  height = 1.8,
  labelTitle = "INDUS FOOD",
  labelSubtitle = "Peeled Tomatoes",
} = {}) {
  const group = new THREE.Group();

  const canGeom = new THREE.CylinderGeometry(radius, radius, height, 32);
  const canMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.2,
  });
  const can = new THREE.Mesh(canGeom, canMaterial);
  can.castShadow = true;
  can.receiveShadow = true;
  group.add(can);

  const rimGeomTop = new THREE.TorusGeometry(radius, 0.04, 16, 32);
  rimGeomTop.rotateX(Math.PI / 2);
  rimGeomTop.translate(0, height / 2, 0);
  const rimTop = new THREE.Mesh(rimGeomTop, canMaterial);
  group.add(rimTop);

  const rimGeomBot = rimGeomTop.clone();
  rimGeomBot.position.y = -height;
  group.add(rimGeomBot);

  const labelGeom = new THREE.CylinderGeometry(radius + 0.01, radius + 0.01, height * 0.75, 32, 1, true);
  const labelTex = createLabelTexture(labelTitle, labelSubtitle, "#F7F3E9", "#B93A22");
  const labelMaterial = new THREE.MeshStandardMaterial({
    map: labelTex,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  const label = new THREE.Mesh(labelGeom, labelMaterial);
  group.add(label);

  return group;
}

export function createLeafMesh() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.3, 0.5, 0.5, 1.2, 0, 2.0);
  shape.bezierCurveTo(-0.5, 1.2, -0.3, 0.5, 0, 0);

  const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02, bevelThickness: 0.01 };
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a7c39,
    roughness: 0.35,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const leaf = new THREE.Mesh(geom, leafMaterial);
  leaf.castShadow = true;
  return leaf;
}

export function createParticleSystem(count = 80) {
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    scales[i] = Math.random() * 0.15 + 0.05;
  }

  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xe54b4b,
    size: 0.25,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geom, mat);
}

/* ==========================================
   HERO FULL SCENE 3D CANVAS (Scroll & Parallax)
   ========================================== */

export function Hero3DCanvas() {
  const containerRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    let renderer, animationFrameId;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 8);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
      dirLight.position.set(5, 8, 5);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const rimLight = new THREE.DirectionalLight(0xe54b4b, 1.5);
      rimLight.position.set(-5, -2, -3);
      scene.add(rimLight);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      const heroTomato = createTomatoMesh({ radius: 1.35, color: 0xd9381e });
      heroTomato.position.set(0.6, 0.2, 0);
      mainGroup.add(heroTomato);

      const yellowTomato = createTomatoMesh({ radius: 1.0, color: 0xe3a23d });
      yellowTomato.position.set(-1.2, -0.4, 0.5);
      mainGroup.add(yellowTomato);

      const smallTomato = createTomatoMesh({ radius: 0.85, color: 0xb93a22 });
      smallTomato.position.set(1.8, -0.6, 0.8);
      mainGroup.add(smallTomato);

      const jar = createJarMesh({ width: 0.9, height: 1.6, labelTitle: "INDUS", labelSubtitle: "Puree" });
      jar.position.set(-1.8, 0.8, -0.5);
      jar.rotation.z = 0.15;
      mainGroup.add(jar);

      const leaf1 = createLeafMesh();
      leaf1.position.set(1.5, 1.6, 0.4);
      leaf1.scale.set(0.4, 0.4, 0.4);
      mainGroup.add(leaf1);

      const leaf2 = createLeafMesh();
      leaf2.position.set(-0.8, -1.6, 1.0);
      leaf2.scale.set(0.35, 0.35, 0.35);
      leaf2.rotation.z = 1.2;
      mainGroup.add(leaf2);

      const particles = createParticleSystem(100);
      scene.add(particles);

      let targetX = 0;
      let targetY = 0;
      let scrollY = 0;

      const handleMouseMove = (e) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        targetX = (e.clientX - windowHalfX) * 0.001;
        targetY = (e.clientY - windowHalfY) * 0.001;
      };

      const handleScroll = () => {
        scrollY = window.scrollY;
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("scroll", handleScroll);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 480;
        const h = container.clientHeight || 480;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        heroTomato.rotation.y = elapsedTime * 0.3;
        heroTomato.position.y = 0.2 + Math.sin(elapsedTime * 1.5) * 0.12;

        yellowTomato.rotation.y = elapsedTime * 0.4;
        yellowTomato.position.y = -0.4 + Math.cos(elapsedTime * 1.2) * 0.1;

        smallTomato.rotation.x = elapsedTime * 0.5;
        smallTomato.position.y = -0.6 + Math.sin(elapsedTime * 1.8) * 0.08;

        jar.rotation.y = elapsedTime * 0.25;
        jar.position.y = 0.8 + Math.sin(elapsedTime * 1.4 + 1) * 0.14;

        leaf1.rotation.y = elapsedTime * 0.8;
        leaf1.rotation.z = Math.sin(elapsedTime) * 0.3;

        leaf2.rotation.y = elapsedTime * 0.6;
        particles.rotation.y = elapsedTime * 0.05;

        const scrollFactor = scrollY * 0.0015;
        mainGroup.rotation.y += (targetX + scrollFactor - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetY - mainGroup.rotation.x) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        if (renderer && container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn("Hero3DCanvas WebGL render catch:", err);
      setHasError(true);
    }
  }, []);

  if (hasError) return null;
  return <div ref={containerRef} className="three-hero-container" />;
}

/* ==========================================
   PRODUCT CARD 3D VIEWPORT
   ========================================== */

export function Product3DViewport({ productTone = "tomato", productName = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 250;
    const height = container.clientHeight || 180;

    let renderer, frameId;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      camera.position.set(0, 0, 5);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
      dirLight.position.set(3, 5, 4);
      scene.add(dirLight);

      let mesh;
      if (productName.includes("Paste") || productName.includes("Canned")) {
        mesh = createCanMesh({ radius: 0.95, height: 1.8, labelTitle: "INDUS", labelSubtitle: productName });
      } else {
        let fillColor = 0xb82315;
        if (productTone === "gold") fillColor = 0xcc4411;
        mesh = createJarMesh({ width: 1.0, height: 1.7, fillColor, labelTitle: "INDUS", labelSubtitle: productName });
      }

      scene.add(mesh);

      let targetRotY = 0;
      let targetRotX = 0;

      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        targetRotY = (x / rect.width) * 1.2;
        targetRotX = (y / rect.height) * 0.8;
      };

      const handleMouseLeave = () => {
        targetRotY = 0;
        targetRotX = 0;
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        mesh.rotation.y += (targetRotY + elapsedTime * 0.4 - mesh.rotation.y) * 0.08;
        mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.08;
        mesh.position.y = Math.sin(elapsedTime * 2) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(frameId);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        if (renderer && container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn("Product3DViewport WebGL catch:", err);
    }
  }, [productTone, productName]);

  return <div ref={containerRef} className="product-3d-viewport" />;
}

/* ==========================================
   LIFECYCLE STAGE 3D VIEWPORT
   ========================================== */

export function Lifecycle3DViewport({ stageId = "sun_ripened" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    let renderer, frameId;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      camera.position.set(0, 0, 5);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
      dirLight.position.set(4, 6, 4);
      scene.add(dirLight);

      const stageGroup = new THREE.Group();
      scene.add(stageGroup);

      if (stageId === "seedling") {
        const soilGeom = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
        const soilMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
        const soil = new THREE.Mesh(soilGeom, soilMat);
        soil.position.y = -0.8;
        stageGroup.add(soil);

        const sprout1 = createLeafMesh();
        sprout1.scale.set(0.3, 0.3, 0.3);
        sprout1.position.set(-0.1, 0.1, 0);
        sprout1.rotation.z = -0.3;
        stageGroup.add(sprout1);

        const sprout2 = createLeafMesh();
        sprout2.scale.set(0.3, 0.3, 0.3);
        sprout2.position.set(0.1, 0.2, 0);
        sprout2.rotation.z = 0.4;
        stageGroup.add(sprout2);

      } else if (stageId === "flowering") {
        const flowerGroup = new THREE.Group();
        const centerGeom = new THREE.SphereGeometry(0.2, 16, 16);
        const centerMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3 });
        flowerGroup.add(new THREE.Mesh(centerGeom, centerMat));

        const petalMat = new THREE.MeshStandardMaterial({ color: 0xfff75e, roughness: 0.3, side: THREE.DoubleSide });
        for (let i = 0; i < 6; i++) {
          const petalGeom = new THREE.ConeGeometry(0.18, 0.7, 4);
          petalGeom.rotateX(Math.PI / 2.5);
          const petal = new THREE.Mesh(petalGeom, petalMat);
          petal.rotation.z = (i / 6) * Math.PI * 2;
          flowerGroup.add(petal);
        }
        stageGroup.add(flowerGroup);

      } else if (stageId === "green_vine") {
        const greenTom = createTomatoMesh({ radius: 1.1, color: 0x7ba356 });
        stageGroup.add(greenTom);

      } else if (stageId === "sun_ripened") {
        const redTom = createTomatoMesh({ radius: 1.25, color: 0xd9381e });
        stageGroup.add(redTom);

      } else if (stageId === "pureed") {
        const jar = createJarMesh({ width: 1.1, height: 1.8, fillColor: 0xb82315 });
        stageGroup.add(jar);
      }

      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        stageGroup.rotation.y = elapsedTime * 0.6;
        stageGroup.position.y = Math.sin(elapsedTime * 2) * 0.08;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(frameId);
        if (renderer && container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn("Lifecycle3DViewport WebGL catch:", err);
    }
  }, [stageId]);

  return <div ref={containerRef} className="lifecycle-3d-viewport" />;
}

/* ==========================================
   WHOLESALE INDUSTRIAL DRUMS 3D VIEWPORT
   ========================================== */

export function Wholesale3DViewport({ drumCount = 10, flexitankCount = 1 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 350;
    const height = container.clientHeight || 240;

    let renderer, frameId;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
      camera.position.set(0, 3, 9);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfffaed, 2.5);
      dirLight.position.set(5, 10, 5);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const stackGroup = new THREE.Group();
      scene.add(stackGroup);

      const palletGeom = new THREE.BoxGeometry(4.5, 0.2, 4.5);
      const palletMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
      const pallet = new THREE.Mesh(palletGeom, palletMat);
      pallet.position.y = -1.5;
      pallet.receiveShadow = true;
      stackGroup.add(pallet);

      const drumMat = new THREE.MeshStandardMaterial({ color: 0x2b5b84, metalness: 0.8, roughness: 0.3 });
      const maxDrumsToShow = Math.min(drumCount, 16);

      for (let i = 0; i < maxDrumsToShow; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const drumGeom = new THREE.CylinderGeometry(0.45, 0.45, 1.1, 24);
        const drum = new THREE.Mesh(drumGeom, drumMat);
        drum.castShadow = true;
        drum.position.set((col - 1.5) * 1.0, -0.85 + row * 1.15, (Math.floor(i / 8) - 0.5) * 1.0);
        stackGroup.add(drum);
      }

      if (flexitankCount > 0) {
        const flexiGeom = new THREE.BoxGeometry(3.5, 1.6, 2.0);
        const flexiMat = new THREE.MeshStandardMaterial({ color: 0xc4432a, metalness: 0.3, roughness: 0.5 });
        const flexi = new THREE.Mesh(flexiGeom, flexiMat);
        flexi.position.set(0, 0.5, 0);
        flexi.castShadow = true;
        stackGroup.add(flexi);
      }

      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        stackGroup.rotation.y = elapsedTime * 0.3;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(frameId);
        if (renderer && container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn("Wholesale3DViewport WebGL catch:", err);
    }
  }, [drumCount, flexitankCount]);

  return <div ref={containerRef} className="wholesale-3d-viewport" />;
}

/* ==========================================
   PRODUCT TECHNICAL INFO 3D MODEL VIEWPORT
   ========================================== */

export function Tech3DModelViewport({ tab = "summary" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    let renderer, frameId;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      camera.position.set(0, 0, 5.5);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
      dirLight.position.set(4, 6, 5);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const rimLight = new THREE.DirectionalLight(0xe54b4b, 1.2);
      rimLight.position.set(-4, -2, -3);
      scene.add(rimLight);

      const group = new THREE.Group();
      scene.add(group);

      if (tab === "summary") {
        // 3D Canned Whole Peeled Tomatoes Tin
        const can = createCanMesh({ radius: 1.0, height: 2.0, labelTitle: "INDUS FOOD", labelSubtitle: "Whole Peeled" });
        group.add(can);
      } else if (tab === "packaging") {
        // Trio of 3D Jars & Cans
        const canSmall = createCanMesh({ radius: 0.6, height: 1.2, labelTitle: "200g", labelSubtitle: "Tin Can" });
        canSmall.position.set(-1.2, -0.2, 0);
        group.add(canSmall);

        const jarMed = createJarMesh({ width: 0.9, height: 1.7, fillColor: 0xb82315, labelTitle: "800g", labelSubtitle: "Glass Jar" });
        jarMed.position.set(0, 0.1, 0.3);
        group.add(jarMed);

        const drumBig = createCanMesh({ radius: 0.75, height: 1.8, labelTitle: "4kg", labelSubtitle: "Bulk Tin" });
        drumBig.position.set(1.3, -0.1, -0.2);
        group.add(drumBig);
      } else if (tab === "specifications") {
        // 3D Sun Ripened Red Tomato & Puree Jar
        const tom = createTomatoMesh({ radius: 1.1, color: 0xd9381e });
        tom.position.set(-0.8, -0.1, 0.3);
        group.add(tom);

        const jar = createJarMesh({ width: 0.95, height: 1.8, fillColor: 0xb82315, labelTitle: "100% PURE", labelSubtitle: "Puree" });
        jar.position.set(0.8, 0.1, 0);
        group.add(jar);
      } else if (tab === "analysis") {
        // 3D Chemical Refractometer cylinder & Brix test sphere
        const cylinderGeom = new THREE.CylinderGeometry(0.7, 0.7, 2.2, 32);
        const cylinderMat = new THREE.MeshPhysicalMaterial({
          color: 0xe54b4b,
          transmission: 0.85,
          opacity: 1,
          transparent: true,
          roughness: 0.1,
          ior: 1.5
        });
        const cylinder = new THREE.Mesh(cylinderGeom, cylinderMat);
        group.add(cylinder);

        const sphereGeom = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0xe3a23d, roughness: 0.2, metalness: 0.3 });
        const sphere = new THREE.Mesh(sphereGeom, sphereMat);
        sphere.position.set(0, 0.8, 0);
        group.add(sphere);
      }

      let scrollY = 0;
      const handleScroll = () => { scrollY = window.scrollY; };
      window.addEventListener("scroll", handleScroll);

      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Scroll-driven continuous 3D rotation & hover tilt
        const scrollRotation = scrollY * 0.002;
        group.rotation.y = elapsedTime * 0.4 + scrollRotation;
        group.rotation.x = Math.sin(elapsedTime * 1.5) * 0.08;
        group.position.y = Math.sin(elapsedTime * 2) * 0.06;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("scroll", handleScroll);
        if (renderer && container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn("Tech3DModelViewport WebGL catch:", err);
    }
  }, [tab]);

  return <div ref={containerRef} className="tech-3d-viewport" />;
}

/* ==========================================
   NAVBAR 3D ANIMATED LOGO VIEWPORT
   ========================================== */

export function Navbar3DLogoCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 40;
    const height = container.clientHeight || 40;

    let renderer, frameId;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
      camera.position.set(0, 0, 3.8);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfffaed, 2.5);
      dirLight.position.set(2, 4, 3);
      scene.add(dirLight);

      const group = new THREE.Group();
      scene.add(group);

      // Create a 3D Glossy Tomato Logo Specimen
      const tomMesh = createTomatoMesh({ radius: 0.85, color: 0xd9381e });
      group.add(tomMesh);

      const clock = new THREE.Clock();

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        group.rotation.y = elapsedTime * 1.2;
        group.rotation.x = Math.sin(elapsedTime * 1.5) * 0.15;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(frameId);
        if (renderer && container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn("Navbar3DLogoCanvas WebGL catch:", err);
    }
  }, []);

  return <div ref={containerRef} style={{ width: 40, height: 40, pointerEvents: "none" }} />;
}
