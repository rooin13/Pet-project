import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface ContainerProps {
	children: ReactNode;
	className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
	return <div className={cn("_container", className)}>{children}</div>;
};
