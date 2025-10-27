"use client";

import { FC, ReactNode } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/Popover";
import Image from "next/image";
import Link from "next/link";
import { useGetCartQuery } from "@/shared/lib/api/cart/cartApi";
import { getImageSrc } from "@/shared/lib/utils/productUtils";
import { Spinner } from "@/shared/ui";

interface CartPopoverProps {
	trigger: ReactNode; // сюда передаем кнопку Add to Cart
}

export const CartPopover: FC<CartPopoverProps> = ({ trigger }) => {
	const { data: cart, isLoading, isError } = useGetCartQuery();

	return (
		<Popover>
			<PopoverTrigger>{trigger}</PopoverTrigger>

			<PopoverContent className="w-80 p-0 pt-2 pb-2 pl-1 bg-secondary">
				{isLoading && (
					<div className="flex items-center justify-center py-6">
						<Spinner size={20} />
					</div>
				)}
				{isError && <p>Failed to load cart</p>}
				{cart && cart.items.length === 0 && <p>Your cart is empty</p>}

				{cart && cart.items.length > 0 && (
					<div
						className={`flex flex-col gap-4 text-black ${
							cart.items.length > 2
								? "max-h-72 overflow-y-auto"
								: ""
						}`}
					>
						{cart.items.map((item) => {
							const product = item.variation.product;
							return (
								<div
									key={item.id}
									className="flex items-center gap-4"
								>
									<Image
										src={getImageSrc(product.imagesUrl)}
										width={60}
										height={60}
										alt={product.name}
										className="rounded"
									/>
									<div>
										<p className="font-medium">
											{product.name}
										</p>
										<p className="text-sm text-gray-500">
											Quantity: {item.quantity}
										</p>
									</div>
								</div>
							);
						})}

						<Link href="/cart">
							<button className="w-full cursor-pointer px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200">
								View Cart
							</button>
						</Link>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};

export default CartPopover;
