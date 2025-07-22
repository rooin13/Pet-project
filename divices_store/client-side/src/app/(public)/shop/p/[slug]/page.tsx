import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma/prisma";
import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { defaultImage } from "@/shared/lib/utils/getProductImage";
import { ProductDetails } from "@/entities/product/ui/ProductDetail";

type ProductWithCategory = Prisma.ProductGetPayload<{
	include: { category: true };
}>;

type Props = { params: { slug: string } };

async function getProduct(slug: string): Promise<ProductWithCategory | null> {
	try {
		return await prisma.product.findUnique({
			where: { slug },
			include: { category: true },
		});
	} catch (e) {
		console.error(`Error finding product by slug: ${slug}`, e);
		return null;
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = decodeURIComponent(params.slug);
	const product = await getProduct(slug);

	if (!product) return notFoundMetadata();

	return {
		title: product.name,
		description: product.description?.substring(0, 160) ?? "",
		keywords: [product.category.name, "купить", product.name],
		openGraph: {
			title: product.name,
			description: product.description?.substring(0, 160) ?? "",
			url: `https://your-site.com/shop/p/${params.slug}`,
			siteName: "YourStore",
			locale: "ru_RU",
			type: "website",
			images: getProductImages(product),
		},
		twitter: {
			card: "summary_large_image",
			title: product.name,
			description: product.description?.substring(0, 160) ?? "",
			images: getProductImages(product).map((img) => img.url),
		},
	};
}

function notFoundMetadata(): Metadata {
	return {
		title: "Not Found",
		description: "Product not found",
	};
}

function getProductImages(product: ProductWithCategory) {
	const images = Array.isArray(product.imagesUrl) ? product.imagesUrl : [];
	return images.length
		? images
				.filter((u): u is string => typeof u === "string")
				.slice(0, 4)
				.map((url) => ({ url, alt: product.name }))
		: [defaultImage];
}

// Рендеринг динамических маршрутов
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const products = await prisma.product.findMany({ select: { slug: true } });
	return products.map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: Props) {
	const product = await getProduct(params.slug);
	if (!product) return notFound();

	return (
		<ProductDetails
			id={product.id}
			name={product.name}
			imagesUrl={product.imagesUrl}
			price={product.price}
			slug={product.slug}
			description={product.description}
			categoryId={product.category.id}
			brandId={product.brandId}
			createdAt={product.createdAt}
			updatedAt={product.updatedAt}
		/>
	);
}
