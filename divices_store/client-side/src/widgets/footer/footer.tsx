import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-white border-t border-black text-black px-6 py-10">
			<div className="max-w-7xl mx-auto grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				{/* Contacts */}
				<div>
					<h3 className="font-semibold mb-3 text-lg">Contacts</h3>
					<ul className="text-sm">
						<li>
							<a
								href="mailto:support@example.com"
								className="hover:underline transition-opacity duration-200 ease-in-out hover:opacity-80"
							>
								support@example.com
							</a>
						</li>
						<li>
							<a
								href="tel:+1234567890"
								className="hover:underline transition-opacity duration-200 ease-in-out hover:opacity-80"
							>
								+1 234 567 890
							</a>
						</li>
						<li className="text-gray-700">123 Main St, City</li>
					</ul>
				</div>

				{/* Careers */}
				<div>
					<h3 className="font-semibold mb-3 text-lg">Careers</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Open Positions
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Internships
							</a>
						</li>
					</ul>
				</div>

				{/* Investors */}
				<div>
					<h3 className="font-semibold mb-3 text-lg">Investors</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Investor Relations
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Financial Reports
							</a>
						</li>
					</ul>
				</div>

				{/* Blog */}
				<div>
					<h3 className="font-semibold mb-3 text-lg">Blog</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Latest News
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Tech Articles
							</a>
						</li>
					</ul>
				</div>

				{/* Press */}
				<div>
					<h3 className="font-semibold mb-3 text-lg">Press</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Press Releases
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:underline hover:opacity-80"
							>
								Media Contacts
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* нижняя плашка */}
			<div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
				© {new Date().getFullYear()} Hex Inc. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
