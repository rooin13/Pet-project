"use client";

import { useState, useEffect } from "react";

export const ConnectSpotifyButton = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Проверяем подключен ли Spotify
		checkConnection();
	}, []);

	const checkConnection = async () => {
		console.log("🔍 Checking Spotify connection status...");
		try {
			const response = await fetch("/api/spotify/status");
			const data = await response.json();
			console.log("📊 Spotify status:", data);
			setIsConnected(data.connected);
		} catch (error) {
			console.error("❌ Failed to check Spotify connection:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleConnect = () => {
		console.log("🎵 CONNECTING SPOTIFY...");
		console.log("🔗 Redirecting to /api/spotify/auth");
		// Редирект на Spotify OAuth
		window.location.href = "/api/spotify/auth";
	};

	const handleDisconnect = async () => {
		if (!confirm("Are you sure you want to disconnect Spotify?")) return;

		console.log("🔌 DISCONNECTING SPOTIFY...");
		try {
			const response = await fetch("/api/spotify/disconnect", { method: "POST" });
			if (response.ok) {
				console.log("✅ Spotify disconnected successfully");
				setIsConnected(false);
			} else {
				console.error("❌ Disconnect request failed:", response.status);
			}
		} catch (error) {
			console.error("❌ Failed to disconnect Spotify:", error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center gap-2 text-gray-400 text-sm">
				<div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
				Checking Spotify connection...
			</div>
		);
	}

	if (isConnected) {
		return (
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2 text-sm text-green-400">
					<svg
						className="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
					</svg>
					Spotify Connected
				</div>
				<button
					onClick={handleDisconnect}
					className="text-sm text-red-400 hover:text-red-300 text-left"
				>
					Disconnect
				</button>
			</div>
		);
	}

	return (
		<button
			onClick={handleConnect}
			className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-white font-medium rounded-sm transition"
		>
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
			</svg>
			Connect Spotify
		</button>
	);
};
