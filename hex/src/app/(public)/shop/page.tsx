import CategoriesList from "@/widgets/categories/ui/categories-list/CategoriesList";
import { prisma } from "@/shared/lib/prisma/prisma";
import { Category } from "@prisma/client";
import { CategoriesSwiper } from "@/widgets/categories/ui/categories-swiper/CategoriesSwiper";

export const metadata = {
	title: "Shop",
	description: "",
};

const getCategories = async (): Promise<Category[] | null> => {
	const categories = await prisma.category.findMany();
	return categories;
};

export default async function Page() {
	const categories = await getCategories();
	if (!categories) return null;

	return (
		<section className="bg-white pt-10 md:px-10 px-3">
			<h2 className="text-black font-semibold text-6xl mb-15">Shop</h2>
			<div className="w-full relative mb-40">
				<CategoriesSwiper categories={categories} />
			</div>
			{/* Список всех категорий с центрированием */}
			<div className="max-w-7xl mx-auto">
				<h3 className="text-black font-semibold text-2xl mb-10 text-left">
					Shop All Product Categories
				</h3>
				<div className="flex justify-center">
					<CategoriesList categories={categories} />
				</div>
			</div>
		</section>
	);
}
