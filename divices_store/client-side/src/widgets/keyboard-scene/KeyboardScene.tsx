"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "react-responsive";

export default function KeyboardScene() {
	const [progress, setProgress] = useState(0);
	const isMobile = useMediaQuery({ maxWidth: 768 });

	useEffect(() => {
		const section = document.getElementById("keyboard-section");
		if (!section) return;

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const offsetStart = sectionHeight * 0.1;
			const rawProgress =
				(scrollTop - sectionTop - offsetStart) / sectionHeight;
			const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

			setProgress((prev) => {
				if (Math.abs(prev - clampedProgress) < 0.001) return prev; // если почти не изменилось, не обновляем
				return clampedProgress;
			});
		};
		handleScroll();

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<Canvas
			style={{ height: isMobile ? "80%" : "100%" }}
			camera={{ position: [0, 4, 4], fov: 50 }}
		>
			<ambientLight intensity={1} />
			<directionalLight position={[22, 10, 90]} intensity={12} />
			<Suspense fallback={null}>
				<RotatingKeyboard progress={progress} />
			</Suspense>
		</Canvas>
	);
}

function RotatingKeyboard({ progress }: { progress: number }) {
	const groupRef = useRef<THREE.Group>(null);
	const gltf = useGLTF("/models/keyboard.glb");

	// useFrame вызываем всегда, даже если сцена ещё не загрузилась
	useFrame(() => {
		if (groupRef.current && gltf.scene) {
			const targetRotation = progress * Math.PI * 1;
			groupRef.current.rotation.y = targetRotation;
		}
	});

	// если сцена ещё не загрузилась, ничего не рендерим, но хуки уже вызваны
	if (!gltf.scene) return null;

	return (
		<primitive
			position={[0, 1, 0]}
			ref={groupRef}
			object={gltf.scene}
			scale={0.54}
			dispose={null}
		/>
	);
}
