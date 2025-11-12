// "use client";
// import { FC } from "react";
// import { UseFormRegister, FieldErrors } from "react-hook-form";
// import { CheckoutForm } from "../model/validation";
// import { CardType } from "../lib/card";
// import { IMaskInput } from "react-imask";

// interface PaymentFormProps {
// 	register: UseFormRegister<CheckoutForm>;
// 	errors: FieldErrors<CheckoutForm>;
// 	paymentMethod: "card" | "paypal";
// 	setPaymentMethod: (val: "card" | "paypal") => void;
// 	cardType: CardType;
// 	handleCardInput: (value: string) => void;
// }

// const PaymentForm: FC<PaymentFormProps> = ({
// 	register,
// 	errors,
// 	paymentMethod,
// 	setPaymentMethod,
// 	cardType,
// 	handleCardInput,
// }) => {
// 	return (
// 		<div className="flex-1 space-y-4 mb-4">
// 			<h3 className="text-2xl mb-5 pl-4 rounded-md text-white bg-black">
// 				Payment Method
// 			</h3>

// 			<div className="flex gap-4 mb-2">
// 				<label className="flex items-center gap-2 text-black">
// 					<input
// 						type="radio"
// 						value="card"
// 						checked={paymentMethod === "card"}
// 						onChange={() => setPaymentMethod("card")}
// 					/>
// 					<span>Credit Card</span>
// 				</label>
// 				<label className="flex items-center gap-2 text-black">
// 					<input
// 						type="radio"
// 						value="paypal"
// 						checked={paymentMethod === "paypal"}
// 						onChange={() => setPaymentMethod("paypal")}
// 					/>
// 					<span>PayPal</span>
// 				</label>
// 			</div>

// 			{paymentMethod === "card" ? (
// 				<>
// 					<div className="relative">
// 						{cardType && (
// 							<img
// 								src={
// 									cardType === "visa"
// 										? "/images/card-icons/visa-icon.svg"
// 										: "/images/card-icons/mastercard-icon.svg"
// 								}
// 								alt={cardType}
// 								className="absolute top-1/2 right-3 -translate-y-1/2 h-6 w-10"
// 							/>
// 						)}
// 						<IMaskInput
// 							mask="0000 0000 0000 0000"
// 							placeholder="Card Number"
// 							{...register("cardNumber")}
// 							className={`border p-2 w-full rounded-lg text-black ${
// 								errors.cardNumber ? "border-red-500" : ""
// 							}`}
// 							onAccept={handleCardInput}
// 						/>
// 					</div>
// 					<div className="flex gap-2">
// 						<IMaskInput
// 							mask="00/00"
// 							placeholder="MM/YY"
// 							{...register("expiry")}
// 							className={`border p-2 w-1/2 rounded-lg text-black ${
// 								errors.expiry ? "border-red-500" : ""
// 							}`}
// 						/>
// 						<IMaskInput
// 							mask="000"
// 							placeholder="CVV"
// 							{...register("cvv")}
// 							className={`border p-2 w-1/2 rounded-lg text-black ${
// 								errors.cvv ? "border-red-500" : ""
// 							}`}
// 						/>
// 					</div>
// 				</>
// 			) : (
// 				<input
// 					type="email"
// 					placeholder="PayPal Email"
// 					{...register("paypalEmail")}
// 					className={`border p-2 w-full rounded-lg text-black ${
// 						errors.paypalEmail ? "border-red-500" : ""
// 					}`}
// 				/>
// 			)}
// 		</div>
// 	);
// };

// export default PaymentForm;
