import { PAGES } from "@/shared/lib/config/pages.config";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoriesProps {
	categories: Category[];
}

const CategoriesList: React.FC<CategoriesProps> = ({ categories }) => {
	return (
		<div>
			<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{categories.map((category) => (
					<li
						key={category.id}
						className="rounded-3xl bg-secondery overflow-hidden flex flex-col items-center justify-center"
					>
						<Link
							href={PAGES.CATEGORY(category)}
							className="w-full h-full flex flex-col items-center"
						>
							<div className="w-full relative">
								<Image
									src={category.imageUrl}
									alt={category.name}
									width={300}
									height={200}
									className="w-full h-auto object-contain"
								/>
							</div>

							<div className="w-full py-2 flex items-center justify-center">
								<p className="text-black text-base sm:text-lg font-medium text-center">
									{category.name}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CategoriesList;
