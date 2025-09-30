import { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CheckoutForm } from "../model/validation";

interface BillingFormProps {
	register: UseFormRegister<CheckoutForm>;
	errors: FieldErrors<CheckoutForm>;
}

const BillingForm: FC<BillingFormProps> = ({ register, errors }) => {
	return (
		<div className="space-y-4 flex-1">
			<h3 className="text-2xl rounded-md mb-5 pl-4 text-white bg-black">
				Billing Details
			</h3>

			<input
				type="text"
				placeholder="First Name"
				{...register("firstName")}
				className={`border p-2 w-full rounded-lg text-black ${
					errors.firstName ? "border-red-500" : ""
				}`}
			/>

			<input
				type="text"
				placeholder="Last Name"
				{...register("lastName")}
				className={`border p-2 w-full rounded-lg text-black ${
					errors.lastName ? "border-red-500" : ""
				}`}
			/>

			{/* Обычный input для адреса */}
			<input
				type="text"
				placeholder="Address"
				{...register("address")}
				className={`border p-2 w-full rounded-lg text-black ${
					errors.address ? "border-red-500" : ""
				}`}
			/>

			<input
				type="text"
				placeholder="ZIP Code"
				{...register("zipCode")}
				className={`border p-2 w-full rounded-lg text-black ${
					errors.zipCode ? "border-red-500" : ""
				}`}
			/>
		</div>
	);
};

export default BillingForm;
