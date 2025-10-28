function Footer() {
	return (
		<footer className="flex items-center justify-end space-x-4 py-6 text-white gap-6 relative z-50">
			<a
				href="https://vk.com"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Visit our VK page"
				className="hover:opacity-70 transition-opacity"
			>
				<svg width={45} height={45} aria-hidden="true">
					<use xlinkHref={`/images/icons/icons.xml#vk`} />
				</svg>
			</a>
			<a
				href="https://t.me"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Visit our Telegram channel"
				className="hover:opacity-70 transition-opacity"
			>
				<svg width={45} height={45} aria-hidden="true">
					<use xlinkHref={`/images/icons/icons.xml#telegram`} />
				</svg>
			</a>
			<a
				href="https://youtube.com"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Visit our YouTube channel"
				className="hover:opacity-70 transition-opacity"
			>
				<svg width={45} height={45} aria-hidden="true">
					<use xlinkHref={`/images/icons/icons.xml#youtube`} />
				</svg>
			</a>
		</footer>
	);
}

export default Footer;
