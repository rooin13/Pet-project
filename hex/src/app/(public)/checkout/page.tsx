"use client";

import { FC } from "react";
import { useCart } from "@/widgets/cart/model/useCart";
import { useCheckout } from "@/features/checkout-form/model/hooks/useCheckout";
import CartItem from "@/widgets/cart/cart-item/ui/CartItem";
import BillingForm from "@/features/checkout-form/ui/BillingForm";

const CheckoutPage: FC = () => {
	const {
		cartItems,
		subtotal,
		shipping,
		total,
		isLoading: cartLoading,
	} = useCart();
	const { user, userLoading, isSubmitting, form, onSubmit } = useCheckout();

	if (cartLoading || userLoading)
		return <p className="p-10 text-black">Loading checkout...</p>;
	if (cartItems.length === 0)
		return <p className="p-10 text-black">Your cart is empty.</p>;

	const handleFormSubmit = form.handleSubmit((data) =>
		onSubmit(data, cartItems, total)
	);

	return (
		<main className="pb-5 space-y-6">
			<section
				className="bg-white rounded-xl md:p-6"
				aria-label="Order summary"
			>
				<h1 className="text-3xl font-light text-center text-white bg-black rounded-md pl-4 mb-6">
					Checkout
				</h1>

				{cartItems.map((item) => (
					<CartItem item={item} key={item.id} />
				))}

				<div className="mt-6 border-t pt-4">
					<div className="flex justify-between text-base mb-2">
						<span className="text-gray-600">Subtotal:</span>
						<span className="text-black">
							${subtotal.toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between text-base mb-2">
						<span className="text-gray-600">Shipping:</span>
						<span className="text-black">
							{shipping === 0
								? "Free"
								: `$${shipping.toFixed(2)}`}
						</span>
					</div>
					<div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
						<span className="text-black">Total:</span>
						<span className="text-black">${total.toFixed(2)}</span>
					</div>
				</div>
			</section>

			<section
				className="bg-white rounded-xl md:p-6 flex flex-col gap-6"
				aria-label="Billing information"
			>
				<form
					onSubmit={handleFormSubmit}
					className="flex flex-col w-full gap-6"
				>
					<BillingForm
						register={form.register}
						errors={form.formState.errors}
						setValue={form.setValue}
					/>

					<button
						type="submit"
						disabled={isSubmitting || !user}
						className={`w-full py-3 rounded-lg font-semibold transition-colors ${
							isSubmitting || !user
								? "bg-gray-400 text-gray-200 cursor-not-allowed"
								: "bg-black text-white hover:bg-gray-800"
						}`}
						aria-label={
							!user
								? "Sign in required to place order"
								: "Place order"
						}
					>
						{isSubmitting ? "Processing..." : "Place Order"}
					</button>

					{!user && (
						<p
							className="text-center text-red-600 text-sm"
							role="alert"
						>
							Please sign in to place your order
						</p>
					)}
				</form>
			</section>
		</main>
	);
};

export default CheckoutPage;
