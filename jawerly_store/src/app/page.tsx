import Image from "next/image";
import Link from "next/link";

import Hero from "@/widgets/hero/ui/Hero";
import SliderSection from "@/widgets/slider-section/ui/SliderSection";
import Colection from "@/widgets/collection/ui/Colection";
import TrendingGift from "@/widgets/trending-gift/ui/TrendingGift";
import CategoryCarousels from "@/widgets/сategory-сarousels/CategoryCarousels";
import Customize from "@/widgets/customize/ui/Customize";
import OurPromise from "@/widgets/our-promise/ui/OurPromise";
import { SubscribeForm } from "@/widgets/subcribe-form";
import ProductList from "@/widgets/product-list";
import Button from "@/shared/ui/button/Button";

const ourpromiseSvg = "/images/ourpromise.svg";
const ourpromise2Svg = "/images/ourpromise2.svg";
const ourpromise3Svg = "/images/ourpromise3.svg";
const ourpromise4Svg = "/images/ourpromise4.svg";
const ourpromise5Svg = "/images/ourpromise5.svg";
const ourpromise6Svg = "/images/ourpromise6.svg";

export const Home = () => {
	return (
		<main className="bg-white">
			<Hero></Hero>
			<section className="bg-primary  pb-5 pt-5">
				<div className="_container ">
					<p className="text-white fs text-2xl text-center w-1/5">
						The UAE’s No.1 Online Gift Store for Customized Gift
						Products & Jewellery
					</p>
				</div>
			</section>
			<SliderSection></SliderSection>
			<Colection></Colection>
			<TrendingGift></TrendingGift>
			<CategoryCarousels></CategoryCarousels>
			<Customize></Customize>
			<section className=" p-36 justify-center flex">
				<div className="relative flex justify-end text-text border-3 pt-32 pb-32 pr-12 max-w-3xl">
					<div className="absolute perfect-gift-img">
						<Image
							width={330}
							height={330}
							alt="perfectGift"
							src={"/images/perfectGIft.webp"}
						></Image>
					</div>
					<div className="flex basis-3/6 flex-col">
						<h3 className="text-3xl mb-4">
							A Perfect Gift for Him !!!
						</h3>
						<p className="text-lightText text-sm leading-5 mb-5">
							Cufflinks are the most Unique Gift for Men on any
							occasion, such as Anniversary, Birthday or Farewell
							etc. Browse our amazing collection of Cufflinks
							which are handcrafted so perfectly to turn these
							cufflinks into lifetime memorable Gift
						</p>
						<div>
							<Button type="outline">EXPLORE COLLECTION</Button>
						</div>
					</div>
				</div>
			</section>
			<section className="_container flex flex-col items-center pb-3">
				<div className=" flex items-center text-text flex-col mb-16">
					<h2 className="text-4xl mb-4 ">Cufflinks</h2>

					<ProductList
						count={6}
						jsonUrl="/products.json"
					></ProductList>
				</div>
				<div>
					<Button type={"outline"}> VIEW ALL</Button>
				</div>
			</section>
			<section className="h-900 mb-4">
				<div
					className="h-64 bg-cover bg-no-repeat bg-bottom"
					style={{
						backgroundImage: `url(/images/mostamzinggift3.webp)`,
					}}
				></div>
				<div
					className="flex items-center justify-center h-96 bg-cover bg-no-repeat bg-center"
					style={{
						backgroundImage: `url(/images/mostamzinggift2.jpg)`,
					}}
				>
					<p className="text-white text-3xl">
						Most Amazing Gift For Men Ever
					</p>
				</div>
				<div
					className="h-80 bg-cover bg-no-repeat bg-center"
					style={{
						backgroundImage: `url(/images/mostamzinggift.jpg`,
					}}
				></div>
			</section>
			<OurPromise></OurPromise>
			<section className="pt-40 pb-10">
				<div className="_container flex flex-col items-center">
					<h2 className="text-4xl mb-14">
						Sign up now for Best Promotions, Discounts & Deals.
					</h2>
					<SubscribeForm type="footer"></SubscribeForm>
				</div>
			</section>

			<section
				className=" h-200 bg-cover bg-no-repeat bg-center"
				style={{ backgroundImage: `url(/images/blyabackground.webp)` }}
			>
				<div className="flex justify-center items-center _container h-200 bg-cover bg-no-repeat bg-center">
					<h2 className="text-2xl text-white">
						LOVE ISN'T SOMETHING YOU FIND. LOVE IS SOMETHING THAT
						FINDS YOU.
					</h2>
				</div>
			</section>
		</main>
	);
};

export default Home;
