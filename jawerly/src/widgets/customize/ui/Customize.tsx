import Button from "@/shared/ui/button/Button";
import React from "react";

function Customize() {
	return (
		<section>
			<div className=" flex flex-row bg-FFD8AE">
				<div
					className="basis-1/2 bg-cover bg-no-repeat bg-center"
					style={{
						backgroundImage: `url(/images/castomizeBackground.png)`,
					}}
				></div>
				<div className="text basis-1/2  bc-primary flex  p-20 flex-col">
					<h2 className="text-3xl max-w-50 text-text mb-5">
						Customizable Gift Ideas & Personalized Silver Jewellery
					</h2>

					<p className="text-lightText leading-6 mb-4	">
						The Best Gifts to Express your Feelings & Happiness with
						Engravable Jewellery. We Offering many personalized Gift
						Products for Men & Women for any Special Occasions, such
						as Anniversary, Birthday, Valentines Day or Mother’s Day
						& Father’s Day etc. Kindly explore our customized Gift
						collection to found a wonderful Gift, as every piece is
						"Handmade with Love for your Loved ones"
					</p>
					<p className="text-lightText leading-6	mb-4">
						We accept Personalize Custom Made Designs on Requests as
						well so Don’t wait & contact Us today !!!
					</p>
					<p className="text-lightText leading-6	mb-5">
						We will surely make your most desiring imagination Gift
						into Reality.
					</p>
					<div>
						<Button>CUSTOMIZE NOW !!!</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Customize;
