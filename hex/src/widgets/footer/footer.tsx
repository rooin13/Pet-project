import React from "react";

const Footer: React.FC = () => {
	return (
		<footer
			className="bg-white border-t border-black text-black px-6 py-10"
			role="contentinfo"
			aria-label="Site footer"
		>
			<nav
				className="max-w-7xl mx-auto grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
				aria-label="Footer navigation"
			>
				{/* Contacts */}
				<section aria-labelledby="footer-contacts">
					<h3
						id="footer-contacts"
						className="font-semibold mb-3 text-lg"
					>
						Contacts
					</h3>
					<ul className="text-sm">
						<li>
							<a
								href="mailto:support@example.com"
								className="hover:underline transition-opacity duration-200 ease-in-out hover:opacity-80"
								aria-label="Email us at support@example.com"
							>
								support@example.com
							</a>
						</li>
						<li>
							<a
								href="tel:+1234567890"
								className="hover:underline transition-opacity duration-200 ease-in-out hover:opacity-80"
								aria-label="Call us at +1 234 567 890"
							>
								+1 234 567 890
							</a>
						</li>
						<li
							className="text-gray-700"
							aria-label="Address: 123 Main St, City"
						>
							123 Main St, City
						</li>
					</ul>
				</section>

				{/* Careers */}
				<section aria-labelledby="footer-careers">
					<h3
						id="footer-careers"
						className="font-semibold mb-3 text-lg"
					>
						Careers
					</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="View open positions"
							>
								Open Positions
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="Learn about internships"
							>
								Internships
							</a>
						</li>
					</ul>
				</section>

				{/* Investors */}
				<section aria-labelledby="footer-investors">
					<h3
						id="footer-investors"
						className="font-semibold mb-3 text-lg"
					>
						Investors
					</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="View investor relations"
							>
								Investor Relations
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="View financial reports"
							>
								Financial Reports
							</a>
						</li>
					</ul>
				</section>

				{/* Blog */}
				<section aria-labelledby="footer-blog">
					<h3 id="footer-blog" className="font-semibold mb-3 text-lg">
						Blog
					</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="Read latest news"
							>
								Latest News
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="Browse tech articles"
							>
								Tech Articles
							</a>
						</li>
					</ul>
				</section>

				{/* Press */}
				<section aria-labelledby="footer-press">
					<h3
						id="footer-press"
						className="font-semibold mb-3 text-lg"
					>
						Press
					</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="View press releases"
							>
								Press Releases
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
								aria-label="Contact media relations"
							>
								Media Contacts
							</a>
						</li>
					</ul>
				</section>
			</nav>

			{/* нижняя плашка */}
			<div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
				© {new Date().getFullYear()} Hex Inc. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
