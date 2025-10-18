import type { Metadata } from "next";
import type { FC } from "react";

import Cart from "@/widgets/cart/Cart";

export const metadata: Metadata = {
	title: "Cart",
	description: "Cart page",
};

const CartPage: FC = () => {
	return (
		<section className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
			<Cart />
		</section>
	);
};

export default CartPage;
