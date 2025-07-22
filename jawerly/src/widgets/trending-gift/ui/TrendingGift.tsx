import Button from "@/shared/ui/button/Button";
import React from "react";

export default function TrendingGift() {
	return (
		<div
			className="relative bg-cover bg-no-repeat bg-center  w-full p-20 mb-14"
			style={{
				backgroundImage: `url(/images/images/collectionBackground.jpg)`,
			}}
		>
			<div className="_container flex-col flex flex-wrap items-center">
				<h1 className="text-white text-5xl text-center mb-7">
					The Most Trending Gift Products for Men & Women
				</h1>
				<p className="text-white text-center text-lg mb-9">
					We are so Thrilled & Exited to take your experience to the
					next level by shopping at our online Gift Shop. Personalized
					Gift Jewellery Products are top rated fashion statement from
					many decades, our Gift Collection is amazingly wonderful &
					crafted With 925 Sterling Silver by our Designers. so kindly
					Browse our Gift Shop to find a Most Perfect Gift Ever for
					Your Loved Ones.
				</p>
				<Button disabled={false} link="https://www.example.com">
					EXPLORE NOW
				</Button>
			</div>
		</div>
	);
}
