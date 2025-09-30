"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetCartQuery } from "@/shared/lib/api/cart/cartApi";
import CartItem from "@/widgets/cart/cart-item/ui/CartItem";
import BillingForm from "@/features/checkout-form/ui/BillingForm";
import {
	CheckoutForm,
	checkoutSchema,
} from "@/features/checkout-form/model/validation";

const CheckoutPage: FC = () => {
	const { data: cart, isLoading } = useGetCartQuery();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutForm>({
		resolver: zodResolver(checkoutSchema),
	});

	if (isLoading) return <p className="p-10">Loading checkout...</p>;
	if (!cart) return <p className="p-10">Cart is empty.</p>;

	const cartItems = cart.items;
	const subtotal = cart.totalAmount;
	const shipping = subtotal > 39 ? 0 : 15;
	const total = subtotal + shipping;

	const onSubmit = async (data: CheckoutForm) => {
		console.log("Form submitted:", data);

		try {
			const res = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					cartItems, // array с variation + quantity
					total, // можно, но Stripe считает line_items отдельно
				}),
			});

			const result = await res.json();

			if (result.success && result.url) {
				if (
					result.success &&
					result.url &&
					typeof window !== "undefined"
				) {
					window.location.href = result.url;
				}
			} else {
				alert("Error: " + result.error);
			}
		} catch (err) {
			console.error(err);
			alert("Unexpected error occurred");
		}
	};

	return (
		<div className="pt-12 pb-5 space-y-6">
			<div className="bg-white rounded-xl md:p-6">
				<h2 className="text-3xl font-light text-center text-white bg-black rounded-md pl-4 mb-6">
					Checkout
				</h2>

				{cartItems.map((item) => (
					<CartItem item={item} key={item.id} />
				))}

				<div className="mt-6 flex font-bold text-lg">
					<span className="text-black mr-4">Total:</span>
					<span className="text-black">${total.toFixed(2)}</span>
				</div>
			</div>

			<div className="bg-white rounded-xl  md:p-6 flex flex-col gap-6">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col w-full gap-6"
				>
					<BillingForm register={register} errors={errors} />

					<button
						type="submit"
						className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
					>
						Place Order
					</button>
				</form>
			</div>
		</div>
	);
};

export default CheckoutPage;
