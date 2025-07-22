import { getFiltersByCategory } from "@/features/filtration/model/getFiltersByCategory";
import { ProductsByCatefories } from "@/widgets/products-by-categories/ProductsByCatefories";

export default async function Page({ params }: { params: { slug: string } }) {
	const filters = await getFiltersByCategory(params.slug);
	return (
		<ProductsByCatefories
			currentCategory={params.slug}
			initialFilters={filters}
		/>
	);
}
