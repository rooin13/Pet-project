import type { Metadata } from "next";
import type { FC } from "react";

import Cart from "@/widgets/cart/Cart";

export const metadata: Metadata = {
	title: "Cart",
	description: "Cart page",
};

const CartPage: FC = () => {
	return (
		<section className="container ">
			<Cart />
		</section>
	);
};

export default CartPage;
