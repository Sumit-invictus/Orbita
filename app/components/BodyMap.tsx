
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BodyMapProps {
  fatigue: number;
  stress: number;
}

const BodyMap: React.FC<BodyMapProps> = ({ fatigue, stress }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // --- Tactical Scan Shader ---
    const tacticalShader = {
      uniforms: {
        time: { value: 0 },
        accentColor: { value: new THREE.Color(0x10b981) }, // Emerald accent
        baseColor: { value: new THREE.Color(0x0d9488) }, // Teal base
        fatigueIntensity: { value: fatigue / 100 },
        scanLinePos: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 accentColor;
        uniform vec3 baseColor;
        uniform float fatigueIntensity;
        uniform float scanLinePos;
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          // Density of topography
          float topoLines = sin(vPosition.y * 120.0 + time * 2.0);
          topoLines = smoothstep(0.85, 0.98, topoLines);

          // Density of vertical wireframe
          float vertLines = sin(vPosition.x * 60.0);
          vertLines = smoothstep(0.95, 1.0, vertLines);

          // Moving scan line
          float distToScan = abs(vPosition.y - scanLinePos);
          float scanGlow = smoothstep(0.2, 0.0, distToScan);
          
          // Fresnel rim lighting
          float fresnel = pow(1.2 - max(0.0, dot(vNormal, vec3(0,0,1))), 3.0);
          
          vec3 finalColor = mix(baseColor, accentColor, scanGlow);
          finalColor += accentColor * topoLines * 0.4;
          finalColor += accentColor * vertLines * 0.2;
          
          // Transparency logic
          float alpha = (topoLines * 0.3 + vertLines * 0.1 + fresnel * 0.6 + scanGlow * 0.5);
          
          // Apply fatigue visual (reddish tint on scan if high)
          vec3 fatigueColor = vec3(1.0, 0.2, 0.2);
          finalColor = mix(finalColor, fatigueColor, fatigueIntensity * scanGlow * 0.5);

          gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
        }
      `
    };

    const material = new THREE.ShaderMaterial({
      uniforms: tacticalShader.uniforms,
      vertexShader: tacticalShader.vertexShader,
      fragmentShader: tacticalShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // --- Refined Professional Humanoid ---
    const humanoidGroup = new THREE.Group();

    // Use refined geometries to create a stylized, professional humanoid
    const createPart = (geometry: THREE.BufferGeometry, y: number, scale: [number, number, number] = [1,1,1]) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = y;
      mesh.scale.set(...scale);
      humanoidGroup.add(mesh);
      return mesh;
    };

    createPart(new THREE.SphereGeometry(0.32, 32, 32), 1.3, [0.85, 1, 0.9]); // Head
    createPart(new THREE.CylinderGeometry(0.48, 0.4, 1.5, 32, 1, true), 0.45); // Torso
    createPart(new THREE.SphereGeometry(0.44, 32, 16), -0.3, [1, 0.8, 0.7]); // Pelvis
    
    // Detailed Arm Segments
    const armGeom = new THREE.CylinderGeometry(0.08, 0.06, 0.7, 16, 1);
    const createArm = (side: number) => {
        const upper = new THREE.Mesh(armGeom, material);
        upper.position.set(0.6 * side, 0.8, 0);
        upper.rotation.z = 0.2 * side;
        humanoidGroup.add(upper);

        const lower = new THREE.Mesh(armGeom, material);
        lower.position.set(0.7 * side, 0.2, 0);
        lower.rotation.z = 0.1 * side;
        humanoidGroup.add(lower);
    };
    createArm(1); createArm(-1);

    // Detailed Leg Segments
    const legGeom = new THREE.CylinderGeometry(0.18, 0.12, 1.0, 16, 1);
    const createLeg = (side: number) => {
        const thigh = new THREE.Mesh(legGeom, material);
        thigh.position.set(0.22 * side, -0.9, 0);
        humanoidGroup.add(thigh);

        const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 1.0, 16, 1), material);
        calf.position.set(0.22 * side, -1.8, 0);
        humanoidGroup.add(calf);
    };
    createLeg(1); createLeg(-1);

    scene.add(humanoidGroup);

    // --- Auxiliary Tactical Grid ---
    const grid = new THREE.GridHelper(10, 20, 0x10b981, 0x1c1c1e);
    grid.position.y = -2.5;
    grid.rotation.x = Math.PI / 2;
    grid.material.transparent = true;
    grid.material.opacity = 0.05;
    scene.add(grid);

    camera.position.z = 7;
    camera.position.y = -0.5;

    // --- Animation Loop ---
    let frameId: number;
    let scanLineDir = 1;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      humanoidGroup.rotation.y += 0.01;
      material.uniforms.time.value += 0.02;
      
      // Update scan line
      material.uniforms.scanLinePos.value += 0.02 * scanLineDir;
      if (Math.abs(material.uniforms.scanLinePos.value) > 2) scanLineDir *= -1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      material.dispose();
    };
  }, [fatigue, stress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair group">
      <div ref={mountRef} className="w-full h-full relative z-10" />
      
      {/* HUD Scanning Details */}
      <div className="absolute inset-0 border border-white/[0.02] pointer-events-none">
          <div className="absolute top-10 left-10 text-[8px] font-black uppercase text-orb-accent tracking-[0.5em] animate-pulse">Scanning_Active</div>
          <div className="absolute top-10 right-10 flex flex-col items-end gap-1">
             <div className="w-20 h-0.5 bg-white/5 overflow-hidden"><div className="w-3/4 h-full bg-orb-accent/40 animate-[liquid_3s_ease-in-out_infinite]"></div></div>
             <span className="text-[7px] font-mono text-orb-muted">RES: 0.12mm</span>
          </div>
          <div className="absolute bottom-10 left-10 text-left">
             <p className="text-[9px] font-bold text-white/40 mb-1">PROX_SYNC: 98.2%</p>
             <p className="text-[7px] font-mono text-orb-muted">LATENCY: 4.2ms</p>
          </div>
      </div>
    </div>
  );
};

export default BodyMap;
