"use client";
import { useState } from "react";

type CartActionsProps = {
	initialQuantity: number;
};

const CartActions = ({ initialQuantity }: CartActionsProps) => {
	const [value, setValue] = useState(initialQuantity);

	const changeQuantity = (sign: "plus" | "minus") => {
		setValue((prev) => {
			if (sign === "plus") {
				return prev + 1;
			}
			if (sign === "minus" && prev > 1) {
				return prev - 1;
			}
			return prev;
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.target.value);

		if (!isNaN(newValue)) {
			setValue(Math.max(1, newValue));
		}
	};

	return (
		<div className="flex pl-2 pr-2 border-2 justify-between border-whiteDark rounded-md w-24 gap-2">
			<div className="flex items-center">
				<button
					className="w-10 bg-white"
					onClick={() => changeQuantity("minus")}
					aria-label="Уменьшить количество"
				>
					-
				</button>
				<input
					value={value}
					onChange={handleInputChange}
					className="w-full pl-1 focus:outline-none text-center"
					type="number"
					aria-label="Количество товара"
				/>
				<button
					className="w-10 bg-white"
					onClick={() => changeQuantity("plus")}
					aria-label="Увеличить количество"
				>
					+
				</button>
			</div>
		</div>
	);
};

export default CartActions;
