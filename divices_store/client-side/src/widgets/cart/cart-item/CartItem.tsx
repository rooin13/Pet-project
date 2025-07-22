import Image from "next/image";
import { FC } from "react";

import CartActions from "./model/cart-actions";
import { ICartItem } from "./model/type";

const CartItem: FC<{ item: ICartItem }> = ({ item }) => {
	return (
		<div className="bg-white  mb-5 flex text-neutral-500  rounded-xl">
			<Image
				width={240}
				height={100}
				alt="product image"
				src={item.product?.imagesUrl?.[0] || "/placeholder.png"}
			></Image>
			<div className="py-6 px-6 flex justify-between w-full">
				<div className="flex">
					<div className="flex-col">
						<h2 className=" pb-5 text-xl text-black">
							{item.product.name}
						</h2>
						<p className="text-sm font-light mb-24">
							{" "}
							{item.product.description}
						</p>
						<div>
							<CartActions initialQuantity={item.quantity} />
						</div>
					</div>
				</div>
				<div className=" flex flex-col  justify-between">
					<p className="font-light text-right text-black">
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(item.product.price)}
					</p>
					<div className="flex mb-1">
						<button className="cursor-pointer text-xs mr-4">
							Remove
						</button>
						<button className="cursor-pointer text-xs">
							Move to Wishlist
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
