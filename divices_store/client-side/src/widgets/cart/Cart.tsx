"use client";
import { FC } from "react";
import { Skeleton, Spinner } from "@/shared/ui";
import CartItem from "./cart-item/ui/CartItem";
import { useCart } from "./model/useCart";
import Link from "next/link";
import { Truck } from "lucide-react";

const Cart: FC = () => {
	const {
		cartItems,
		subtotal,
		shipping,
		total,
		isLoading,
		isError,
		isEmpty,
	} = useCart();

	return (
		<main className="pt-8 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
			{/* Список товаров */}
			<section
				className="order-2 lg:order-1 lg:col-span-7"
				aria-label="Shopping cart items"
			>
				<h1 className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 font-light inline-block">
					Cart
				</h1>
				{isLoading ? (
					<div className="flex h-40 items-center justify-center">
						<Spinner size={28} />
					</div>
				) : cartItems.length === 0 ? (
					<h3 className="text-xl sm:text-2xl mb-6 sm:mb-8">
						Your shopping cart is empty.
					</h3>
				) : (
					cartItems
						.slice()
						.sort((a, b) => a.id - b.id)
						.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-2xl shadow-sm px-6 py-5 mb-5"
							>
								<CartItem item={item} />
							</div>
						))
				)}
				{isError && (
					<p className="mt-4 text-red-600" role="alert">
						Failed to load cart
					</p>
				)}
			</section>

			{/* Блок Summary (на мобилках сверху) */}
			<aside
				className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6"
				role="complementary"
				aria-label="Order summary"
			>
				<div className="bg-white mt-4 rounded-xl border border-black/10 shadow-md px-6 py-5">
					<div className="flex items-center gap-4">
						<Truck
							className="text-black w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
							aria-hidden="true"
						/>
						<p className="text-black text-sm sm:text-base font-normal leading-relaxed">
							Free shipping on orders over $29.00 and free returns
						</p>
					</div>
				</div>

				<div className="flex flex-col bg-white rounded-2xl shadow-lg pb-5 px-6 sm:pb-7 sm:px-8 pt-5 sm:pt-6">
					<h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
						Summary
					</h2>

					<div className="flex flex-col sm:flex-row justify-between border-b-2 border-b-primary pb-4 sm:pb-8">
						<ul className="flex flex-col space-y-2 sm:space-y-3">
							<li>Subtotal</li>
							<li>Estimated Shipping</li>
							<li>Total Savings</li>
						</ul>
						<ul className="flex flex-col space-y-2 sm:space-y-3 text-right mt-2 sm:mt-0">
							{isLoading ? (
								<div className="animate-pulse">
									<li>
										<Skeleton className="h-4 w-20 ml-auto" />
									</li>
									<li>
										<Skeleton className="h-4 w-24 ml-auto" />
									</li>
									<li>
										<Skeleton className="h-4 w-16 ml-auto" />
									</li>
								</div>
							) : (
								<>
									<li>${subtotal.toFixed(2)}</li>
									<li>
										{shipping > 0
											? `$${shipping}`
											: "Free shipping"}
									</li>
									<li>$0.00</li>
								</>
							)}
						</ul>
					</div>

					<div className="flex justify-between pt-4 sm:pt-5">
						<h2 className="font-bold">Total</h2>
						{isLoading ? (
							<div className="animate-pulse">
								<Skeleton className="h-5 w-24" />
							</div>
						) : (
							<p className="font-bold">${total.toFixed(2)}</p>
						)}
					</div>

					<Link
						href={"/checkout"}
						aria-label={`Proceed to checkout with ${cartItems.length} items`}
					>
						{isLoading ? (
							<div className="mt-6 sm:mt-8">
								<Skeleton className="h-10 w-full rounded-lg" />
							</div>
						) : (
							<button
								disabled={cartItems.length === 0}
								className="w-full cursor-pointer hover:bg-gray-800 mt-6 sm:mt-8 bg-black text-white py-3 rounded-lg disabled:opacity-50"
								aria-disabled={cartItems.length === 0}
							>
								Proceed to Checkout
							</button>
						)}
					</Link>
				</div>
			</aside>
		</main>
	);
};

export default Cart;
