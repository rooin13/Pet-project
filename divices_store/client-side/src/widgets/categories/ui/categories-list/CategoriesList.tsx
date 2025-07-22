import { PAGES } from "@/shared/lib/config/pages.config";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoriesProps {
	categories: Category[];
}

const CategoriesList: React.FC<CategoriesProps> = async ({ categories }) => {
	return (
		<div>
			<ul className="flex  flex-wrap gap-8 space-y-3">
				{categories.map((category, idx) => (
					<Link
						key={idx + category.id}
						href={PAGES.CATEGORY(category)}
						className="flex-1/10 shrink-0"
					>
						<li className="rounded-3xl bg-secondery overflow-hidden flex items-center align-bottom justify-center flex-col  relative">
							<div>
								<Image
									className="w-45 h-45"
									alt="Genre image"
									src={category.imageUrl}
									width={300}
									height={200}
								></Image>
							</div>
							<div className=" w-full flex items-center h-20 justify-center">
								<p className="text-black text-1xl">
									{category.name}
								</p>
							</div>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
};

export default CategoriesList;
