import { Circle, ShoppingCart } from "lucide-react";
import React from "react";
import Link from "next/link";
export default function CartBtn() {
	return (
		<Link href="/cart">
			<div className="hover:opacity-50 cursor-pointer text-black mt-2 relative group ">
				<ShoppingCart size={22} className="" />
				<Circle
					fill="#91a5ff"
					stroke="#91a5ff"
					className="absolute left-4 bottom-2 "
					size={20}
				/>
				<p className="absolute text-sm left-11/11 bottom-4/11">3</p>
			</div>
		</Link>
	);
}
