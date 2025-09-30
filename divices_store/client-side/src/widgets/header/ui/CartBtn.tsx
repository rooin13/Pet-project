import { Circle, ShoppingCart } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { useGetCartQuery } from "@/shared/lib/api/cart/cartApi";
export default function CartBtn() {
	const { data: cart } = useGetCartQuery();
	const itemsCount = cart?.items.length ?? 0;
	const atTop = useAppSelector((state) => state.ui.atTop);
	return (
		<Link href="/cart">
			<div className="hover:opacity-50 cursor-pointer text-black mt-2 relative group ">
				<ShoppingCart
					size={22}
					className={`${
						atTop ? "text-black" : "text-white"
					} text-xl font-semibold cursor-pointer`}
				/>
				<Circle
					fill="#91a5ff"
					stroke="#91a5ff"
					className="absolute left-4 bottom-2 "
					size={20}
				/>

				{itemsCount > 0 && (
					<p className="absolute text-sm left-11/11 bottom-4/11">
						{itemsCount}
					</p>
				)}
			</div>
		</Link>
	);
}
