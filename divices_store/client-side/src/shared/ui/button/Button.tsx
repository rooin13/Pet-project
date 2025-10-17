import React from "react";
import "./style.css";

type TProps = {
	type?: "primary" | "outline";
	disabled?: boolean;
	children: React.ReactNode;
	classname?: string;

	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({
	type = "primary",
	disabled,
	children,
	classname,
	onClick,
}: TProps) => {
	const classNames = {
		primary: `bg-secondary text-black border-none w-full `,
		outline: `bg-white text-blue-600 w-full `,
	};

	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`rounded-md z-20 main-btn md:px-9 px-3  py-3 text-xs text-center font-bold ${classNames[type]} ${classname}`}
		>
			{children}
		</button>
	);
};

export default Button;
