import React from "react";

function Footer() {
	return (
		<div className="flex items-center justify-end space-x-4  py-10 text-white gap-6">
			<svg width={45} height={45}>
				<use xlinkHref={`/images/icons/icons.xml#vk`} />
			</svg>
			<svg width={45} height={45}>
				<use xlinkHref={`/images/icons/icons.xml#telegram`} />
			</svg>
			<svg width={45} height={45}>
				<use xlinkHref={`/images/icons/icons.xml#youtube`} />
			</svg>
		</div>
	);
}

export default Footer;
