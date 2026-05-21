import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ACCENT = 0xC8FF00;
const GREEN = 0x00B140;
const AVATAR_URL = 'https://avatars.githubusercontent.com/u/87342139?v=4';

const HeroScene3D = () => {
  const containerRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof window === 'undefined') return;
    if (!window.WebGLRenderingContext) {
      setIsSupported(false);
      return;
    }

    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'low-power',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(ACCENT, 0.15);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(GREEN, 0.1, 15);
    pointLight.position.set(-3, 2, 3);
    scene.add(pointLight);

    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener('mousemove', onMouseMove);

    const objects = [];
    const objectCount = isMobile ? 4 : 6;

    const geometries = [
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.CylinderGeometry(0.05, 0.05, 0.15, 12),
      new THREE.TorusGeometry(0.08, 0.02, 12, 24),
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.IcosahedronGeometry(0.08, 0),
    ];

    const colors = [ACCENT, GREEN, ACCENT, GREEN, ACCENT, GREEN];

    for (let i = 0; i < objectCount; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        metalness: 0.2,
        roughness: 0.8,
        transparent: true,
        opacity: 0.18,
      });

      const mesh = new THREE.Mesh(geometries[i], material);

      const orbitRadius = 3 + Math.random() * 2;
      const orbitSpeed = 0.03 + Math.random() * 0.05;
      const orbitTilt = (Math.random() - 0.5) * Math.PI * 0.3;
      const orbitOffset = Math.random() * Math.PI * 2;
      const selfRotationSpeed = 0.2 + Math.random() * 0.3;

      objects.push({
        mesh,
        orbitRadius,
        orbitSpeed,
        orbitTilt,
        orbitOffset,
        selfRotationSpeed,
      });

      scene.add(mesh);
    }

    const particleCount = isMobile ? 15 : 25;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      particleSpeeds.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002,
        z: (Math.random() - 0.5) * 0.001,
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: ACCENT,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const orbGroup = new THREE.Group();

    const orbGeometry = new THREE.SphereGeometry(0.4, 24, 24);
    const orbMaterial = new THREE.MeshPhysicalMaterial({
      color: ACCENT,
      metalness: 0.05,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.2,
      transparent: true,
      opacity: 0.1,
    });
    const orbMesh = new THREE.Mesh(orbGeometry, orbMaterial);
    orbGroup.add(orbMesh);

    const ringGeometry = new THREE.TorusGeometry(0.5, 0.008, 8, 48);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    orbGroup.add(ringMesh);

    const ring2Geometry = new THREE.TorusGeometry(0.55, 0.005, 8, 48);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0.15,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2Mesh.rotation.x = Math.PI / 2.2;
    ring2Mesh.rotation.z = Math.PI / 8;
    orbGroup.add(ring2Mesh);

    const textureLoader = new THREE.TextureLoader();
    let avatarSprite = null;
    textureLoader.load(AVATAR_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
      });
      avatarSprite = new THREE.Sprite(spriteMaterial);
      avatarSprite.scale.set(0.6, 0.6, 1);
      avatarSprite.position.z = -0.1;
      orbGroup.add(avatarSprite);
    });

    const orbLight = new THREE.PointLight(ACCENT, 0.15, 3);
    orbGroup.add(orbLight);

    scene.add(orbGroup);

    let animationId;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.008;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.02;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.02;

      camera.position.x = Math.sin(time * 0.1) * 0.15 + smoothMouse.x * 0.1;
      camera.position.y = Math.cos(time * 0.08) * 0.1 + smoothMouse.y * 0.08;
      camera.lookAt(0, 0, 0);

      objects.forEach((obj) => {
        const angle = time * obj.orbitSpeed + obj.orbitOffset;

        obj.mesh.position.x = Math.cos(angle) * obj.orbitRadius;
        obj.mesh.position.y = Math.sin(angle) * obj.orbitRadius * Math.sin(obj.orbitTilt);
        obj.mesh.position.z = Math.sin(angle) * obj.orbitRadius * Math.cos(obj.orbitTilt);

        obj.mesh.rotation.x += obj.selfRotationSpeed * 0.005;
        obj.mesh.rotation.y += obj.selfRotationSpeed * 0.008;

        const dx = obj.mesh.position.x - smoothMouse.x * 2;
        const dy = obj.mesh.position.y - smoothMouse.y * 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 1;

        if (dist < repulsionRadius) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          obj.mesh.position.x += dx * force * 0.01;
          obj.mesh.position.y += dy * force * 0.01;
        }
      });

      const particlePositions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] += particleSpeeds[i].x;
        particlePositions[i * 3 + 1] += particleSpeeds[i].y;
        particlePositions[i * 3 + 2] += particleSpeeds[i].z;

        if (Math.abs(particlePositions[i * 3]) > 6) particleSpeeds[i].x *= -1;
        if (Math.abs(particlePositions[i * 3 + 1]) > 4) particleSpeeds[i].y *= -1;
        if (Math.abs(particlePositions[i * 3 + 2] + 2) > 3) particleSpeeds[i].z *= -1;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      orbGroup.rotation.y = Math.sin(time * 0.1) * 0.05;
      orbGroup.rotation.x = Math.cos(time * 0.08) * 0.03;

      const ringPulse = 1 + Math.sin(time * 0.8) * 0.01;
      ringMesh.scale.set(ringPulse, ringPulse, ringPulse);
      ringMesh.material.opacity = 0.2 + Math.sin(time * 0.8) * 0.05;

      const ring2Pulse = 1 + Math.sin(time * 0.8 + Math.PI) * 0.01;
      ring2Mesh.scale.set(ring2Pulse, ring2Pulse, ring2Pulse);

      pointLight.position.x = smoothMouse.x * 2;
      pointLight.position.y = smoothMouse.y * 2;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      objects.forEach((obj) => {
        obj.mesh.geometry.dispose();
        obj.mesh.material.dispose();
      });

      particleGeometry.dispose();
      particleMaterial.dispose();

      orbGeometry.dispose();
      orbMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();

      if (avatarSprite) {
        avatarSprite.material.map.dispose();
        avatarSprite.material.dispose();
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default HeroScene3D;
