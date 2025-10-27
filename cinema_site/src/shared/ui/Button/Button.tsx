import React, { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	children: ReactNode;
	className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: "bg-primary hover:bg-primary-hover",
	secondary: "bg-secondary hover:bg-gray-700",
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: "px-4 py-1.5 text-sm",
	md: "px-6 py-2 text-base",
	lg: "px-12 py-3 text-lg",
};

const baseStyles =
	"flex justify-center items-center gap-3 rounded-[28px] cursor-pointer transition-colors duration-300 text-white font-light disabled:opacity-50 disabled:cursor-not-allowed";

export const Button = ({
	variant = "primary",
	size = "md",
	children,
	className = "",
	...props
}: ButtonProps) => {
	const combinedClassName = [
		baseStyles,
		variantStyles[variant],
		sizeStyles[size],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button className={combinedClassName} {...props}>
			{children}
		</button>
	);
};

// legacy alias for backwards compatibility
export const Btn = Button;
