import { Circle, ShoppingCart } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { useGetCartQuery } from "@/shared/lib/api/cart/cartApi";
export default function CartBtn() {
	const { data: cart } = useGetCartQuery();
	const itemsCount = cart?.items.length ?? 0;
	const atTop = useAppSelector((state) => state?.ui?.atTop ?? true);
	return (
		<Link
			href="/cart"
			aria-label={`Shopping cart with ${itemsCount} items`}
		>
			<div className="hover:opacity-50 cursor-pointer text-black relative group">
				<ShoppingCart
					size={22}
					className={`${
						atTop ? "text-black" : "text-white"
					} text-xl font-semibold cursor-pointer`}
					aria-hidden="true"
				/>
				<Circle
					fill="#91a5ff"
					stroke="#91a5ff"
					className="absolute left-4 bottom-2"
					size={20}
					aria-hidden="true"
				/>

				{itemsCount > 0 && (
					<span
						className="absolute text-sm left-11/11 bottom-4/11"
						aria-label={`${itemsCount} items in cart`}
					>
						{itemsCount}
					</span>
				)}
			</div>
		</Link>
	);
}
