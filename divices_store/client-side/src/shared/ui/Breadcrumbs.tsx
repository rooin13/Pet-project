"use client";

import Link from "next/link";

export interface CrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: CrumbItem[];
	className?: string;
}

export const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
	return (
		<nav
			aria-label="Breadcrumb"
			className={`text-sm text-black/60 ${className}`}
		>
			<ol className="flex items-center gap-1 flex-wrap">
				{items.map((item, idx) => {
					const isLast = idx === items.length - 1;
					return (
						<li key={idx} className="flex items-center gap-1">
							{item.href && !isLast ? (
								<Link
									href={item.href}
									className="hover:underline hover:text-black"
								>
									{item.label}
								</Link>
							) : (
								<span className="text-black/80">
									{item.label}
								</span>
							)}
							{!isLast && (
								<span className="mx-1 text-black/30">/</span>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
