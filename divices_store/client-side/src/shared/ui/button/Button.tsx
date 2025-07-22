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
		primary: `bg-secondery text-black border-none `,
		outline: `bg-white text-blue-600 border border-azure`,
	};

	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`rounded-md z-20 main-btn px-9  py-3 text-xs text-center font-bold ${classNames[type]} ${classname}`}
		>
			{children}
		</button>
	);
};

export default Button;
