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
import { Trash2, Heart } from "lucide-react";

const CartItem: FC<{ item: CartItemWithVariation }> = ({ item }) => {
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

	if (!variation || !product) return null;

	const price = variation.price ?? product.price ?? 0;

	return (
		<article
			className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center"
			aria-label={`${product.name} in cart`}
		>
			<Link
				href={PAGES.PRODUCT(product)}
				className="shrink-0"
				aria-label={`View ${product.name} details`}
			>
				<div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-xl overflow-hidden bg-white">
					<Image
						src={
							getImageSrc(product.imagesUrl) || "/placeholder.png"
						}
						alt={`${product.name} product image`}
						width={140}
						height={140}
						className="object-contain w-full h-full"
					/>
				</div>
			</Link>

			<div className="flex-1 w-full">
				<div className="flex items-start justify-between gap-3">
					<h2 className="text-lg sm:text-xl font-semibold text-black leading-tight">
						{product.name}
					</h2>
					<p
						className="text-gray-700 text-base sm:text-lg whitespace-nowrap"
						aria-label={`Price: ${new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(price * quantity)}`}
					>
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(price * quantity)}
					</p>
				</div>
				<p className="text-xs sm:text-sm text-neutral-500 mt-1.5 mb-4 line-clamp-2">
					{product.description}
				</p>
				{variation.size && (
					<p className="text-xs sm:text-sm text-neutral-600 mt-1">
						Size:{" "}
						<span className="font-medium">{variation.size}</span>
					</p>
				)}

				<div className="flex flex-wrap items-center justify-between gap-3 mt-4">
					<div
						className="flex items-center border rounded-lg overflow-hidden h-9 sm:h-10 w-[120px] sm:w-[140px]"
						role="group"
						aria-label="Quantity controls"
					>
						<button
							onClick={() => handleChangeQuantity(-1)}
							className="flex-1 text-center text-lg sm:text-2xl hover:bg-gray-200 transition-colors"
							aria-label="Decrease quantity"
						>
							−
						</button>
						<span
							className="flex-1 text-center text-sm sm:text-base font-medium"
							aria-label={`Quantity: ${quantity}`}
						>
							{quantity}
						</span>
						<button
							onClick={() => handleChangeQuantity(1)}
							className="flex-1 text-center text-lg sm:text-2xl hover:bg-gray-200 transition-colors"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>

					<div className="flex items-center gap-4 text-xs sm:text-sm">
						<button
							onClick={handleRemove}
							className="text-black font-light hover:underline flex items-center gap-1.5"
							aria-label={`Remove ${product.name} from cart`}
						>
							<Trash2 className="size-4" aria-hidden="true" />
							Remove
						</button>
						<button
							className="text-black font-light hover:underline flex items-center gap-1.5"
							aria-label={`Add ${product.name} to wishlist`}
						>
							<Heart className="size-4" aria-hidden="true" />
							Wishlist
						</button>
					</div>
				</div>
				<hr className="mt-3 border-black/10" />
			</div>
		</article>
	);
};

export default CartItem;
