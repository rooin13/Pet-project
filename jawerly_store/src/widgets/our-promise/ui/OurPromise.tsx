import React from "react";

const ourpromiseSvg = "/images/ourpromise.svg";
const ourpromise2Svg = "/images/ourpromise2.svg";
const ourpromise3Svg = "/images/ourpromise3.svg";
const ourpromise4Svg = "/images/ourpromise4.svg";
const ourpromise5Svg = "/images/ourpromise5.svg";
const ourpromise6Svg = "/images/ourpromise6.svg";

export default function OurPromise() {
	return (
		<div>
			<section className="flex items-center justify-center flex-col pb-16">
				<h2 className="text-3xl text-lightText mb-4">"OUR PROMISE"</h2>
				<div className=" flex flex-row  flex-wrap  items-center">
					<div className="basis-1/3 mb-7 flex-col flex  items-center">
						<img
							className="h-44 w-44  mb-5"
							src={ourpromiseSvg}
							alt=""
						/>
						<p className="text-primary text-xs">
							GUARANTEED HAPPINESS
						</p>
					</div>
					<div className="basis-1/3 mb-7 flex-col flex  items-center">
						<img
							className="h-44 w-44 mb-5"
							src={ourpromise2Svg}
							alt=""
						/>
						<p className="text-primary text-xs">
							925 SILVER WITH CERTIFICATE
						</p>
					</div>
					<div className="basis-1/3 mb-7 flex-col flex  items-center">
						<img
							className="h-44 w-44 mb-5"
							src={ourpromise3Svg}
							alt=""
						/>
						<p className="text-primary text-xs">
							FREE LIFETIME FURBISHING
						</p>
					</div>
					<div className="basis-1/3 mb-7 flex-col flex  items-center">
						<img
							className="h-44 w-44 mb-5"
							src={ourpromise4Svg}
							alt=""
						/>
						<p className="text-primary text-xs">
							SECURE ONLINE PAYMENT
						</p>
					</div>
					<div className="basis-1/3 mb-7 flex-col flex  items-center">
						<img
							className="h-44 w-44 mb-5"
							src={ourpromise5Svg}
							alt=""
						/>
						<p className="text-primary text-xs">
							FREE DELIVERY IN 2 DAYS*
						</p>
					</div>
					<div className="basis-1/3 mb-7 flex-col flex  items-center">
						<img
							className="h-44 w-44 mb-5"
							src={ourpromise6Svg}
							alt=""
						/>
						<p className="text-primary text-xs">CASH ON DELIVERY</p>
					</div>
				</div>
			</section>
		</div>
	);
}
