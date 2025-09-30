import Image from "next/image";
import { FC, useState } from "react";
import type { CartItemWithVariation } from "../../model/type";
import {
	useRemoveItemMutation,
	useUpdateQuantityMutation,
} from "@/shared/lib/api/cart/cartApi";
import { getImageSrc } from "@/shared/lib/utils/productUtils";
import Link from "next/link";
import { PAGES } from "@/shared/lib/config/pages.config";

const CartItem: FC<{ item: CartItemWithVariation }> = ({ item }) => {
	// хуки вызываем сразу
	const [removeItem] = useRemoveItemMutation();
	const [updateQuantity] = useUpdateQuantityMutation();
	const [quantity, setQuantity] = useState(item.quantity);

	const variation = item.variation;
	const product = variation?.product;

	const handleRemove = async () => {
		await removeItem({ cartItemId: item.id });
	};

	const handleChangeQuantity = async (delta: number) => {
		const newQuantity = quantity + delta;
		if (newQuantity < 1) {
			await handleRemove();
			return;
		}
		setQuantity(newQuantity);
		await updateQuantity({ cartItemId: item.id, quantity: newQuantity });
	};

	if (!variation || !product) return null; // проверку оставляем после хуков

	const price = variation.price ?? product.price ?? 0;

	return (
		<div className="flex flex-col sm:flex-row mb-4 bg-white rounded-xl shadow-sm p-3 sm:p-4 gap-4 sm:gap-6 items-start sm:items-center">
			{/* Картинка */}
			<Link href={PAGES.PRODUCT(product)}>
				<Image
					src={getImageSrc(product.imagesUrl) || "/placeholder.png"}
					alt={product.name}
					width={120}
					height={120}
					className="rounded-xl object-contain max-w-full h-auto"
				/>
			</Link>

			{/* Описание товара */}
			<div className="flex-1 flex flex-col justify-between h-full w-full">
				<div>
					<h2 className="text-base sm:text-lg font-semibold text-black">
						{product.name}
					</h2>
					<p className="text-xs sm:text-sm text-neutral-600 mt-1">
						{product.description}
					</p>
					<div className="text-xs sm:text-sm text-neutral-600 mt-1">
						<p>
							Color:{" "}
							<span className="font-medium">
								{variation.color}
							</span>
						</p>
						{variation.size && (
							<p>
								Size:{" "}
								<span className="font-medium">
									{variation.size}
								</span>
							</p>
						)}
					</div>
				</div>

				{/* Счётчик и цена */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-0">
					<p className="font-light text-gray-600 text-base sm:text-lg">
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(price * quantity)}
					</p>

					<div className="flex items-center border rounded-lg overflow-hidden h-8 sm:h-10 w-[90px] sm:w-[120px]">
						<button
							onClick={() => handleChangeQuantity(-1)}
							className="flex-1 text-center text-lg sm:text-2xl hover:bg-gray-300 transition-colors"
						>
							−
						</button>
						<span className="flex-1 text-center text-sm sm:text-base font-medium">
							{quantity}
						</span>
						<button
							onClick={() => handleChangeQuantity(1)}
							className="flex-1 text-center text-lg sm:text-2xl hover:bg-gray-300 transition-colors"
						>
							+
						</button>
					</div>
				</div>

				{/* Действия */}
				<div className="flex flex-col md:items-start items-start sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-4 text-xs sm:text-sm">
					<button
						onClick={handleRemove}
						className="text-red-500 hover:underline"
					>
						Remove
					</button>
					<button className="text-neutral-600 hover:underline flex items-center gap-1">
						♡ Move to Wishlist
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
