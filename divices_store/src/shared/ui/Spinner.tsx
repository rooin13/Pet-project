import React from "react";

interface SpinnerProps {
	className?: string;
	size?: number; // px
}

export const Spinner: React.FC<SpinnerProps> = ({
	className = "",
	size = 24,
}) => {
	const stroke = Math.max(2, Math.round(size / 12));
	return (
		<div
			role="status"
			aria-live="polite"
			aria-busy="true"
			className={className}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="animate-spin text-black"
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={size / 2 - stroke}
					fill="none"
					stroke="currentColor"
					strokeOpacity="0.2"
					strokeWidth={stroke}
				/>
				<path
					fill="currentColor"
					d={`M ${size / 2} ${stroke} A ${size / 2 - stroke} ${
						size / 2 - stroke
					} 0 0 1 ${size - stroke} ${size / 2}`}
				/>
			</svg>
			<span className="sr-only">Loading</span>
		</div>
	);
};

export default Spinner;
