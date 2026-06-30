'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styles from './ThreeScene.module.css';

export default function ThreeScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // Sphere geometry
        const geometry = new THREE.SphereGeometry(1.4, 64, 64);

        // Wireframe overlay
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x4F8EF7,
            wireframe: true,
            transparent: true,
            opacity: 0.12,
        });
        const wireSphere = new THREE.Mesh(geometry, wireMat);
        scene.add(wireSphere);

        // Core glowing sphere
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a1a,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.9,
        });
        const coreSphere = new THREE.Mesh(geometry, coreMat);
        scene.add(coreSphere);

        // Inner glow sphere
        const glowGeo = new THREE.SphereGeometry(1.6, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x4F8EF7,
            transparent: true,
            opacity: 0.03,
            side: THREE.BackSide,
        });
        const glowSphere = new THREE.Mesh(glowGeo, glowMat);
        scene.add(glowSphere);

        // Outer aura
        const auraGeo = new THREE.SphereGeometry(2.0, 32, 32);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.015,
            side: THREE.BackSide,
        });
        const auraSphere = new THREE.Mesh(auraGeo, auraMat);
        scene.add(auraSphere);

        // Particle ring
        const particleCount = 1200;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.8 + Math.random() * 0.8;
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x4F8EF7,
            size: 0.018,
            transparent: true,
            opacity: 0.5,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const blueLight = new THREE.PointLight(0x4F8EF7, 4, 8);
        blueLight.position.set(3, 2, 2);
        scene.add(blueLight);

        const purpleLight = new THREE.PointLight(0x8B5CF6, 3, 8);
        purpleLight.position.set(-3, -2, 2);
        scene.add(purpleLight);

        const cyanLight = new THREE.PointLight(0x22D3EE, 2, 6);
        cyanLight.position.set(0, 3, -2);
        scene.add(cyanLight);

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Resize handler
        const onResize = () => {
            if (!mount) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        // Animation loop
        let frameId;
        let t = 0;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            t += 0.008;

            wireSphere.rotation.x += 0.003;
            wireSphere.rotation.y += 0.005;

            coreSphere.rotation.x = mouseY * 0.2;
            coreSphere.rotation.y += 0.005 + mouseX * 0.002;

            particles.rotation.x = mouseY * 0.1 + t * 0.05;
            particles.rotation.y = mouseX * 0.1 + t * 0.07;

            glowSphere.rotation.y = -t * 0.03;
            auraSphere.rotation.y = t * 0.02;

            // Breathing effect
            const scale = 1 + Math.sin(t * 1.2) * 0.03;
            glowSphere.scale.setScalar(scale);
            auraSphere.scale.setScalar(scale);

            // Pulsing light
            blueLight.intensity = 3 + Math.sin(t * 2) * 1.5;
            purpleLight.intensity = 2 + Math.cos(t * 1.5) * 1;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            
            // Dispose geometries and materials to avoid memory leaks
            geometry.dispose();
            glowGeo.dispose();
            auraGeo.dispose();
            particleGeo.dispose();
            
            wireMat.dispose();
            coreMat.dispose();
            glowMat.dispose();
            auraMat.dispose();
            particleMat.dispose();
            
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            className={styles.canvas} 
            role="img" 
            aria-label="Sphère 3D interactive décorative avec effets de lumière et particules"
        />
    );
}
