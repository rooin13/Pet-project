import { getFiltersByCategory } from "@/entities/filter/model/getFiltersByCategory";
import { ProductsByCategories } from "@/widgets/products-by-categories/ProductsByCategories";

export default async function Page({ params }: { params: { slug: string } }) {
	const filters = await getFiltersByCategory(params.slug);
	return (
		<ProductsByCategories
			currentCategory={params.slug}
			initialFilters={filters}
		/>
	);
}
