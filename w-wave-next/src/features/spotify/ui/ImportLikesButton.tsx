"use client";

import { useState } from "react";

export const ImportLikesButton = () => {
	const [importing, setImporting] = useState(false);
	const [progress, setProgress] = useState({ current: 0, total: 0 });
	const [result, setResult] = useState<string | null>(null);

	const handleImport = async () => {
		setImporting(true);
		setResult(null);
		setProgress({ current: 0, total: 0 });

		try {
			const response = await fetch("/api/spotify/import-likes", {
				method: "POST",
			});

			const data = await response.json();

			if (data.success) {
				setResult(`✅ Imported ${data.imported} tracks!`);
				setProgress({ current: data.imported, total: data.total });

				// Перезагружаем страницу через 2 сек
				setTimeout(() => {
					window.location.reload();
				}, 2000);
			} else {
				setResult(`❌ ${data.error}`);
			}
		} catch {
			setResult("❌ Failed to import. Connect Spotify first!");
		} finally {
			setImporting(false);
		}
	};

	const progressPercent =
		progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

	return (
		<div className="space-y-3">
			<button
				onClick={handleImport}
				disabled={importing}
				className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white text-sm font-medium transition"
			>
				{importing
					? `Importing... ${progress.current}/${progress.total}`
					: "Import My Liked Songs"}
			</button>

			{/* Прогресс бар */}
			{importing && progress.total > 0 && (
				<div className="space-y-1">
					<div className="w-full h-2 bg-gray-800 overflow-hidden">
						<div
							className="h-full bg-green-500 transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						></div>
					</div>
					<p className="text-xs text-gray-400 text-center">
						{progress.current} / {progress.total} tracks
					</p>
				</div>
			)}

			{result && (
				<p className="text-sm text-gray-400 text-center">{result}</p>
			)}

			<p className="text-xs text-gray-500 text-center">
				Import all your liked songs from Spotify. May take a few minutes
				for large libraries.
			</p>
		</div>
	);
};
