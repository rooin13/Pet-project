"use client";

import { useImportLikes } from "../model";

export const ImportLikesButton = () => {
	const {
		state: { isImporting, progress, result },
		handlers: { importLikes },
	} = useImportLikes();

	const renderResult = () => {
		if (!result) return null;

		if (result.type === "success") {
			return (
				<p className="text-sm text-gray-400 text-center">
					✅ imported {result.imported} tracks
				</p>
			);
		}

		return (
			<p className="text-sm text-gray-400 text-center">
				❌ {result.message}
			</p>
		);
	};

	return (
		<div className="space-y-3">
			<button
				onClick={importLikes}
				disabled={isImporting}
				className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white text-sm font-medium transition"
			>
				{isImporting
					? `importing... ${progress.current}/${progress.total}`
					: "import my liked songs"}
			</button>

			{/* progress */}
			{isImporting && progress.total > 0 && (
				<div className="space-y-1">
					<div className="w-full h-2 bg-gray-800 overflow-hidden">
						<div
							className="h-full bg-purple-500 transition-all duration-300"
							style={{ width: `${progress.percent}%` }}
						></div>
					</div>
					<p className="text-xs text-gray-400 text-center">
						{progress.current} / {progress.total} tracks
					</p>
				</div>
			)}

			{renderResult()}

			<p className="text-xs text-gray-500 text-center">
				import all your liked songs from spotify. may take a few minutes
				for large libraries.
			</p>
		</div>
	);
};
