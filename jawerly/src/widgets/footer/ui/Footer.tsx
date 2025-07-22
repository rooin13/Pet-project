import Link from "next/link";
import React from "react";
import { SubscribeFormFooter } from "./subscribe-form";
const payList = "/images/paylist.svg";
const secured = "/images/secured.svg";

function Footer() {
	return (
		<footer className="pt-32 pb-12 bg-primary">
			<div className="_container ">
				<div className=" flex flex-row justify-between mb-7">
					<div>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								HOME PAGE
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								ALL COLLECTION
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								OUR STORY
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								SILVER CARE AND TIPS
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								CONTACT US
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								SHIPPING POLICY
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								REFUND POLICY
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								PRIVACY POLICY
							</p>
						</Link>
						<Link href={"#"}>
							<p className="mb-3 text-white font-bold text-xxs">
								TERMS OF SERVICE
							</p>
						</Link>
					</div>
					<div>
						<h3 className="mb-3 text-white ">SIGN UP TODAY</h3>
						<p className="mb-5 text-white text-xxs">
							For Best Promotions, New Deals & Discount Sales.
							Directly to your inbox.
						</p>
						<SubscribeFormFooter></SubscribeFormFooter>
					</div>
				</div>
				<div className="flex space justify-between">
					<p className="text-white text-xxs">
						Copyright © 2024, Necklaces by Samaa. Powered by Samaa
						Jewellery, Dubai, UAE.
					</p>
					<div className="flex flex-col justify-center items-center">
						<img src={payList} alt="" />
						<div>
							<img src={secured} alt="" />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
