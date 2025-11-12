// app/shop/p/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/shared/lib/prisma/prisma";
import { getProductImages } from "@/shared/lib";
import { ProductDetails } from "@/entities/product/ui/ProductDetail";
import type { Prisma } from "@prisma/client";

// --- Тип продукта с категориями и вариациями ---
export type ProductWithCategoryAndVariation = Prisma.ProductGetPayload<{
	include: {
		category: true;
		variations: { include: { product: true } };
	};
}>;

type Props = { params: { slug: string } };

// --- Функция получения продукта с вариациями ---
async function getProduct(
	slug: string
): Promise<ProductWithCategoryAndVariation | null> {
	try {
		return await prisma.product.findUnique({
			where: { slug },
			include: {
				category: true,
				variations: {
					include: { product: true }, // ключевой момент — вариации с product
				},
			},
		});
	} catch (e) {
		console.error(`Error finding product by slug: ${slug}`, e);
		return null;
	}
}

// --- Метаданные (остаются тут) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = decodeURIComponent(params.slug);
	const product = await getProduct(slug);
	if (!product) return notFoundMetadata();

	const images = getProductImages(product);

	return {
		title: product.name,
		description: product.description?.substring(0, 160) ?? "",
		keywords: [product.category.name, "купить", product.name],
		openGraph: {
			title: product.name,
			description: product.description?.substring(0, 160) ?? "",
			url: `https://your-site.com/shop/p/${params.slug}`,
			siteName: "Hex",
			locale: "ru_RU",
			type: "website",
			images,
		},
		twitter: {
			card: "summary_large_image",
			title: product.name,
			description: product.description?.substring(0, 160) ?? "",
			images: images.map((img) => img.url),
		},
	};
}

function notFoundMetadata(): Metadata {
	return { title: "Not Found", description: "Product not found" };
}

// --- Генерация статических параметров ---
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const products = await prisma.product.findMany({ select: { slug: true } });
	return products.map((p) => ({ slug: p.slug }));
}

// --- Страница продукта ---
export default async function Page({ params }: Props) {
	const product = await getProduct(params.slug);
	if (!product) return notFound();

	return <ProductDetails {...product} />;
}
