import type { FC } from "react";

import CartItem from "./cart-item/CartItem";
import { cartItemData } from "@/shared/lib/data/cart.data";

const Cart: FC = () => {
	const shippingFee = 15;
	const getSubTotalPrice = () => {
		const price = cartItemData.reduce(
			(total, item) => total + item.product.price * item.quantity,
			0
		);
		const formatedPrice = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price);
		return { formatedPrice, price };
	};
	const getTotalPrice = () => {
		const price =
			getSubTotalPrice().price > 39
				? getSubTotalPrice().price
				: getSubTotalPrice().price + 15;
		const formatedPrice = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price);
		return { formatedPrice };
	};

	return (
		<div className="pt-12 pb-10 flex justify-between gap-8 ">
			<div className="basis-2/3">
				<h2 className="text-5xl mb-10 font-light inline-block">Cart</h2>
				{cartItemData.length > 0 || (
					<h3 className="text-2xl mb-10 inline-flex">
						Your shopping cart is empty.
					</h3>
				)}
				{cartItemData.map((item) => (
					<CartItem item={item} key={item.id}></CartItem>
				))}
			</div>
			<div className="basis-1/3">
				<div className="bg-white rounded-xl pb-5 px-10 pt-5 mb-5">
					<h3 className=" text-1xl font-bold">
						{/* <LocalShippingIcon className='mr-3'></LocalShippingIcon> */}
						Free shipping on orders over $39.00
					</h3>
				</div>
				<div className="flex flex-col bg-white  rounded-xl pb-5 px-10 pt-5">
					<h3 className="text-2xl font-bold mb-10">Summary</h3>
					<div className="flex justify-between border-b-primary border-b-2 pb-10">
						<ul className=" pb-10 flex-col   flex-nowrap space-y-2">
							<li>Subtotal</li>
							<li>Estimated Shipping</li>
							<li>Total Savings</li>
						</ul>
						<ul className="mb-5    ">
							<li> {getSubTotalPrice().formatedPrice}</li>
							<li>
								{getSubTotalPrice().price > 39
									? "-"
									: `$${shippingFee}`}
							</li>
							<li>$0.00</li>
						</ul>
					</div>
					<div className="flex justify-between pt-5">
						<h2 className="font-bold">Total</h2>
						<p className="font-bold">
							{getTotalPrice().formatedPrice}
						</p>
					</div>
					<div></div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
