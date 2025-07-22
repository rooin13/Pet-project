import React from "react";
import CollectionItem from "./collection-item/CollectionItem";

function Colection() {
	return (
		<section className="bg-white ">
			<div className="_container  flex flex-wrap items-center flex-row">
				<h2 className="text-4xl mb-5 text-text">Collection</h2>

				<ul className="flex flex-wrap content-center gap-3 justify-center pb-40">
					<CollectionItem
						src="/images/images/collectionImg1.png"
						alt="collection1"
						title="NECKLACES"
					></CollectionItem>
					<CollectionItem
						src="/images/images/collectionImg2.png"
						title="BRACELETS & ANKLETS"
						alt="collection2"
					></CollectionItem>
					<CollectionItem
						src="/images/images/collectionImg3.png"
						alt="collection3"
						title="RINGS & EARRINGS"
					></CollectionItem>
					<CollectionItem
						src="/images/images/collectionImg4.png"
						alt="collection3"
						title="MEN COLLECTION"
					></CollectionItem>
				</ul>
			</div>
		</section>
	);
}

export default Colection;
