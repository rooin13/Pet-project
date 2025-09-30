"use client";
import { FC } from "react";
import CartItem from "./cart-item/ui/CartItem";
import { useGetCartQuery } from "../../shared/lib/api/cart/cartApi";
import Link from "next/link";

const Cart: FC = () => {
	const { data: cart, isLoading, isError } = useGetCartQuery();
	const shippingFee = 15;

	if (isLoading) return <p className="p-10">Loading cart...</p>;
	if (isError || !cart) return <p className="p-10">Failed to load cart</p>;

	const cartItems = cart.items;
	const subtotal = cart.totalAmount;
	const shipping = subtotal > 39 ? 0 : shippingFee;
	const total = subtotal + shipping;

	return (
		<div className="pt-8 pb-10 flex flex-col md:flex-row gap-8">
			{/* Список товаров */}
			<div className="w-full md:basis-2/3">
				<h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-10 font-light inline-block">
					Cart
				</h2>
				{cartItems.length === 0 ? (
					<h3 className="text-xl sm:text-2xl mb-6 sm:mb-10">
						Your shopping cart is empty.
					</h3>
				) : (
					cartItems
						.slice()
						.sort((a, b) => a.id - b.id)
						.map((item) => <CartItem item={item} key={item.id} />)
				)}
			</div>

			{/* Блок Summary */}
			<div className="w-full md:basis-1/3 flex flex-col gap-5">
				<div className="bg-white rounded-xl pb-4 px-6 sm:pb-5 sm:px-10">
					<h3 className="text-sm sm:text-base font-bold">
						Free shipping on orders over $39.00
					</h3>
				</div>

				<div className="flex flex-col bg-white rounded-xl pb-4 px-6 sm:pb-5 sm:px-10">
					<h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-10">
						Summary
					</h3>

					<div className="flex flex-col sm:flex-row justify-between border-b-2 border-b-primary pb-4 sm:pb-10">
						<ul className="flex flex-col space-y-2 sm:space-y-4">
							<li>Subtotal</li>
							<li>Estimated Shipping</li>
							<li>Total Savings</li>
						</ul>
						<ul className="flex flex-col space-y-2 sm:space-y-4 text-right mt-2 sm:mt-0">
							<li>${subtotal.toFixed(2)}</li>
							<li>
								{shipping > 0
									? `$${shipping}`
									: "Free shipping"}
							</li>
							<li>$0.00</li>
						</ul>
					</div>

					<div className="flex justify-between pt-4 sm:pt-5">
						<h2 className="font-bold">Total</h2>
						<p className="font-bold">${total.toFixed(2)}</p>
					</div>

					<Link href={"/checkout"}>
						<button
							disabled={cartItems.length === 0}
							className="w-full cursor-pointer hover:bg-gray-800 mt-6 sm:mt-10 bg-black text-white py-3 rounded-lg disabled:opacity-50"
						>
							Proceed to Checkout
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Cart;
