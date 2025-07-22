import React, { ReactNode } from "react";

interface BtnProps {
	style: string;
	className?: string;
	onclick: () => void;
	children: ReactNode;
}

export const Btn = ({ style, onclick, className, children }: BtnProps) => {
	const handleClick = () => {
		if (onclick) {
			onclick();
		}
	};
	return (
		<button
			onClick={handleClick}
			className={
				style === "primary" || style === "secondary"
					? `flex justify-center p   items-center flex-grow-0  flex-shrink-0 py-2 relative gap-3 px-12 py- rounded-[28px] 
				 cursor-pointer bg-primary  hover:bg-primary-hover transition-colors duration-300  ${
						"bg-" + style + " " + className
					}`
					: ` hover:bg-primary-hover flex justify-center items-center  flex-shrink-0 pt-3 pb-2 relative gap-3 px-5  rounded-[28px]  cursor-pointer bg-secondary`
			}
		>
			<span className="flex-grow-0 flex-shrink-0 text-lg font-light text-left text-white">
				{children}
			</span>
		</button>
	);
};
