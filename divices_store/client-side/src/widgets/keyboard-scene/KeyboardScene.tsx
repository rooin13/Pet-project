"use client";

import { useEffect, useRef, useState, Suspense } from "react";

// Ленивый импорт всех 3D библиотек
const loadThreeLibs = async () => {
	const [fiber, drei, three] = await Promise.all([
		import("@react-three/fiber"),
		import("@react-three/drei"),
		import("three"),
	]);
	return { fiber, drei, three };
};

export default function KeyboardScene() {
	const [libs, setLibs] = useState<any>(null);
	const [progress, setProgress] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Монтирование
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Загрузка библиотек
	useEffect(() => {
		if (!isMounted) return;

		loadThreeLibs()
			.then((loadedLibs) => {
				console.log("3D libraries loaded");
				setLibs(loadedLibs);
			})
			.catch((err) => {
				console.error("Failed to load 3D libraries:", err);
			});
	}, [isMounted]);

	// Проверка размера экрана
	useEffect(() => {
		if (!isMounted) return;

		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [isMounted]);

	// Обработка скролла
	useEffect(() => {
		if (!isMounted) return;

		const section = document.getElementById("keyboard-section");
		if (!section) return;

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const offsetStart = sectionHeight * 0.09;
			const rawProgress =
				(scrollTop - sectionTop - offsetStart) / sectionHeight;
			const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

			setProgress((prev) => {
				if (Math.abs(prev - clampedProgress) < 0.001) return prev;
				return clampedProgress;
			});
		};
		handleScroll();

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isMounted]);

	// Пока библиотеки не загружены - показываем заглушку
	if (!isMounted || !libs) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<div className="text-white text-lg">Loading 3D Scene...</div>
			</div>
		);
	}

	const { Canvas } = libs.fiber;
	const { useGLTF } = libs.drei;

	return (
		<Canvas
			style={{ height: isMobile ? "80%" : "100%" }}
			camera={{ position: [0, 4, 4], fov: 50 }}
			gl={{ preserveDrawingBuffer: true }}
		>
			<ambientLight intensity={1} />
			<directionalLight position={[22, 10, 90]} intensity={12} />
			<Suspense fallback={null}>
				<RotatingKeyboard
					progress={progress}
					useFrame={libs.fiber.useFrame}
					useGLTF={useGLTF}
					THREE={libs.three}
					isMobile={isMobile}
				/>
			</Suspense>
		</Canvas>
	);
}

function RotatingKeyboard({
	progress,
	useFrame,
	useGLTF,
	THREE,
	isMobile,
}: {
	progress: number;
	useFrame: any;
	useGLTF: any;
	THREE: any;
	isMobile: boolean;
}) {
	const groupRef = useRef<any>(null);
	const gltf = useGLTF("/models/keyboard.glb");

	useFrame(() => {
		if (groupRef.current && gltf?.scene) {
			const targetRotation = progress * Math.PI;
			groupRef.current.rotation.y = targetRotation;
		}
	});

	if (!gltf?.scene) {
		return null;
	}

	return (
		<primitive
			ref={groupRef}
			object={gltf.scene}
			position={[0, 1, 0]}
			scale={isMobile ? 0.64 : 0.7}
		/>
	);
}
