"use client";

import Button from "@/shared/ui/button/Button";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

export const ProductDetails = (product: Product) => {
	const [selectedColor, setSelectedColor] = useState<string>("black");
	const availableColors = ["black", "white", "gray"];

	const InfoBox = ({
		title,
		desc,
		icon,
	}: {
		title: string;
		desc: string;
		icon: string;
	}) => (
		<div className="flex items-start space-x-3 p-4 bg-secondery rounded-xl">
			<div className="text-2xl">{icon}</div>
			<div>
				<p className="font-dsemibol text-black">{title}</p>
				<p className="text-gray-600 text-sm">{desc}</p>
			</div>
		</div>
	);

	return (
		<div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10 pt-20">
			{/* LEFT SIDE */}
			<div className="lg:col-span-2 flex flex-col space-y-6">
				<h2 className="text-3xl ml-17 md:text-5xl font-light text-black mb-10">
					{product.name}
				</h2>
				<p className="text-gray-500 font-light text-base ml-17 max-w-3xl mt-2">
					{product.description}
				</p>
				<div className="relative w-1/2">
					{product.imagesUrl && (
						<Image
							src={
								Array.isArray(product.imagesUrl) &&
								product.imagesUrl.length > 0 &&
								typeof product.imagesUrl[0] === "string"
									? product.imagesUrl[0]
									: "/placeholder.png"
							}
							alt={product.name}
							width={1000}
							height={1000}
							className="rounded-xl w-full h-auto max-h-96 object-cover"
						/>
					)}

					{/* Heart button */}
					<button
						className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full transition"
						title="Add to favorites"
					>
						❤️
					</button>
				</div>
			</div>

			{/* RIGHT SIDE */}
			<div className="flex flex-col space-y-6">
				<div className="bg-white p-6 pt-0 rounded-2xl space-y-">
					<p className="text-3xl mb-9 font-light text-gray-600">
						${product.price}.99
					</p>

					{/* COLOR PICKER */}
					<div className="border-b border-gray-400 pb-10 mb-8">
						<p className="mb-4 text-xl font-light text-black ">
							Select color
						</p>
						<div className="flex space-x-3 mb-10">
							{availableColors.map((color) => (
								<div
									key={color}
									onClick={() => setSelectedColor(color)}
									className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
										selectedColor === color
											? "ring-2 ring-blue-500 border-transparent"
											: "border-gray-300"
									}`}
									style={{ backgroundColor: color }}
								></div>
							))}
						</div>
					</div>

					<Button type="outline" classname="w-full">
						Add to Cart
					</Button>
				</div>

				{/* SHIPPING, WARRANTY, RETURNS */}
				<div className="space-y-4">
					<InfoBox
						icon="🚚"
						title="Fast Shipping"
						desc="Orders before 3pm ship same day."
					/>
					<InfoBox
						icon="🛡️"
						title="2-Year Warranty"
						desc="Protects against all manufacturer faults."
					/>
					<InfoBox
						icon="🔄"
						title="30-Day Returns"
						desc="Return it if it’s not right for you."
					/>
				</div>
			</div>
		</div>
	);
};
