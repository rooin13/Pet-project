import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TProduct } from "../model/type";

const ProductItem: React.FC<TProduct> = ({ id, img, title, price }) => {
	const imageRef = useRef<HTMLImageElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div className="bg-white   overflow-hidden flex flex-col  items-center">
			<div className="relative overflow-hidden flex   items-center  mb-4  ">
				<Link
					href={`#${id}`}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className="overflow-hidden ">
						<Image
							ref={imageRef}
							src={img}
							alt={title}
							width={300}
							height={300}
							className={`transition-transform duration-700 ease-in-out ${
								isHovered ? "scale-105" : ""
							}`}
						/>
					</div>
				</Link>
			</div>
			<div className="p-4 flex flex-col items-center">
				<h3 className="text-base font-semibold text-text mb-1">
					{title}
				</h3>
				<p className="mt-2 text-secondery text-base ">{`Dhs.  ${price.toFixed(
					0
				)}`}</p>
			</div>
		</div>
	);
};

export default ProductItem;
