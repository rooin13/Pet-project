import { FC } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { CheckoutForm } from "../model/validation";
import { useAddressAutocomplete } from "../model/hooks/useAddressAutocomplete";

interface BillingFormProps {
	register: UseFormRegister<CheckoutForm>;
	errors: FieldErrors<CheckoutForm>;
	setValue: UseFormSetValue<CheckoutForm>;
}

const BillingForm: FC<BillingFormProps> = ({ register, errors, setValue }) => {
	const {
		suggestions,
		showSuggestions,
		setShowSuggestions,
		addressInput,
		setAddressInput,
		suggestionsRef,
		handleSelectAddress,
	} = useAddressAutocomplete(setValue);

	return (
		<div className="space-y-4 flex-1">
			<h3 className="text-2xl rounded-md mb-5 pl-4 text-white bg-black">
				Billing Details
			</h3>

			{/* First Name & Last Name */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<input
						type="text"
						placeholder="First Name *"
						{...register("firstName")}
						className={`border p-3 w-full rounded-lg text-black ${
							errors.firstName
								? "border-red-500"
								: "border-gray-300"
						}`}
						aria-label="First Name"
						aria-required="true"
					/>
					{errors.firstName && (
						<p className="text-red-500 text-sm mt-1">
							{errors.firstName.message}
						</p>
					)}
				</div>
				<div>
					<input
						type="text"
						placeholder="Last Name *"
						{...register("lastName")}
						className={`border p-3 w-full rounded-lg text-black ${
							errors.lastName
								? "border-red-500"
								: "border-gray-300"
						}`}
						aria-label="Last Name"
						aria-required="true"
					/>
					{errors.lastName && (
						<p className="text-red-500 text-sm mt-1">
							{errors.lastName.message}
						</p>
					)}
				</div>
			</div>

			{/* Email & Phone */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<input
						type="email"
						placeholder="Email *"
						{...register("email")}
						className={`border p-3 w-full rounded-lg text-black ${
							errors.email ? "border-red-500" : "border-gray-300"
						}`}
						aria-label="Email"
						aria-required="true"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">
							{errors.email.message}
						</p>
					)}
				</div>
				<div>
					<input
						type="tel"
						placeholder="Phone (optional)"
						{...register("phone")}
						className={`border p-3 w-full rounded-lg text-black ${
							errors.phone ? "border-red-500" : "border-gray-300"
						}`}
						aria-label="Phone Number"
					/>
					{errors.phone && (
						<p className="text-red-500 text-sm mt-1">
							{errors.phone.message}
						</p>
					)}
				</div>
			</div>

			{/* Address Autocomplete (бесплатный Nominatim) */}
			<div className="relative" ref={suggestionsRef}>
				<label className="text-black text-sm mb-1 block">
					Street Address *
				</label>
				<input
					type="text"
					placeholder="Start typing address..."
					value={addressInput}
					onChange={(e) => {
						setAddressInput(e.target.value);
						setValue("address", e.target.value);
					}}
					onFocus={() =>
						suggestions.length > 0 && setShowSuggestions(true)
					}
					className={`border p-3 w-full rounded-lg text-black ${
						errors.address ? "border-red-500" : "border-gray-300"
					}`}
					aria-label="Street Address"
					aria-required="true"
					autoComplete="off"
				/>

				{/* Dropdown с suggestions */}
				{showSuggestions && suggestions.length > 0 && (
					<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
						{suggestions.map((suggestion, index) => (
							<button
								key={index}
								type="button"
								onClick={() => handleSelectAddress(suggestion)}
								className="w-full text-left p-3 hover:bg-gray-100 transition-colors border-b last:border-b-0"
							>
								<p className="text-black text-sm font-medium">
									{suggestion.display_name}
								</p>
							</button>
						))}
					</div>
				)}

				{errors.address && (
					<p className="text-red-500 text-sm mt-1">
						{errors.address.message}
					</p>
				)}
			</div>

			{/* City & State */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<input
						type="text"
						placeholder="City *"
						{...register("city")}
						className={`border p-3 w-full rounded-lg text-black ${
							errors.city ? "border-red-500" : "border-gray-300"
						}`}
						aria-label="City"
						aria-required="true"
					/>
					{errors.city && (
						<p className="text-red-500 text-sm mt-1">
							{errors.city.message}
						</p>
					)}
				</div>
				<div>
					<input
						type="text"
						placeholder="State/Province"
						{...register("state")}
						className={`border p-3 w-full rounded-lg text-black ${
							errors.state ? "border-red-500" : "border-gray-300"
						}`}
						aria-label="State or Province"
					/>
					{errors.state && (
						<p className="text-red-500 text-sm mt-1">
							{errors.state.message}
						</p>
					)}
				</div>
			</div>

			{/* ZIP Code & Country */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<input
						type="text"
						placeholder="ZIP / Postal Code *"
						{...register("zipCode")}
						className={`border p-3 w-full rounded-lg text-black ${
							errors.zipCode
								? "border-red-500"
								: "border-gray-300"
						}`}
						aria-label="ZIP or Postal Code"
						aria-required="true"
					/>
					{errors.zipCode && (
						<p className="text-red-500 text-sm mt-1">
							{errors.zipCode.message}
						</p>
					)}
				</div>
				<div>
					<input
						type="text"
						placeholder="Country *"
						{...register("country")}
						defaultValue="United States"
						className={`border p-3 w-full rounded-lg text-black ${
							errors.country
								? "border-red-500"
								: "border-gray-300"
						}`}
						aria-label="Country"
						aria-required="true"
					/>
					{errors.country && (
						<p className="text-red-500 text-sm mt-1">
							{errors.country.message}
						</p>
					)}
				</div>
			</div>

			<p className="text-gray-600 text-sm mt-4">* Required fields</p>
		</div>
	);
};

export default BillingForm;
