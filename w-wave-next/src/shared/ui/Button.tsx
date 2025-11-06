import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	className?: string;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
	return (
		<button className={cn("btn-reset btn", className)} {...props}>
			{children}
		</button>
	);
};
