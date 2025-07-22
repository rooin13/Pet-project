import React, { useState, useEffect } from "react";
import ProductItem from "@/entities/product/ui/productItem";
import { TProduct } from "@/entities/product/model/type";

export type ProductListProps = {
	count: number; // кол во карточек
	jsonUrl: string; //сылка на базу с данными о продуктах
};

const ProductList: React.FC<ProductListProps> = ({ count, jsonUrl }) => {
	const [products, setProducts] = useState<TProduct[]>([]);

	useEffect(() => {
		fetch(jsonUrl)
			.then((res) => res.json())
			.then((data) => {
				const limitedProducts = data.slice(0, count);
				setProducts(limitedProducts);
			});
	}, [jsonUrl, count]);

	return (
		<div className="flex flex-wrap items-center justify-center gap-5">
			{products.map((product) => (
				<ProductItem key={product.id} {...product} />
			))}
		</div>
	);
};

export default ProductList;
