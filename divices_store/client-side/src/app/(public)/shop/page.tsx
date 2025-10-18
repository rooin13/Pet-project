import CategoriesList from "@/widgets/categories/ui/categories-list/CategoriesList";
import { prisma } from "@/shared/lib/prisma/prisma";
import { Category } from "@prisma/client";
import { CategoriesSwiper } from "@/widgets/categories/ui/categories-swiper/CategoriesSwiper";
import { motion } from "framer-motion";

export const metadata = {
	title: "Shop",
	description: "",
};

const getCategories = async (): Promise<Category[] | null> => {
	const categories = await prisma.category.findMany();
	return categories;
};

export default async function Page() {
	const categories = await getCategories();
	if (!categories) return null;

	return (
		<section className="bg-white pt-10 md:px-10 px-3">
			{/* Hero Section */}
			<motion.div
				className="text-center mb-16"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<motion.h1
					className="font-bold text-7xl md:text-8xl mb-6 bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 1, delay: 0.2 }}
				>
					Shop
				</motion.h1>
				<motion.p
					className="text-gray-600 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					Discover premium gaming peripherals and professional
					equipment. From high-performance mice to mechanical
					keyboards, find everything you need for the ultimate setup.
				</motion.p>

				{/* Stats Section */}
				<motion.div
					className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 mb-16"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
				>
					<motion.div
						className="text-center"
						whileHover={{ scale: 1.1, y: -5 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<div className="text-4xl md:text-5xl font-bold text-black mb-2">
							500+
						</div>
						<div className="text-gray-600">Products</div>
					</motion.div>
					<motion.div
						className="text-center"
						whileHover={{ scale: 1.1, y: -5 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<div className="text-4xl md:text-5xl font-bold text-black mb-2">
							50K+
						</div>
						<div className="text-gray-600">Happy Customers</div>
					</motion.div>
					<motion.div
						className="text-center"
						whileHover={{ scale: 1.1, y: -5 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<div className="text-4xl md:text-5xl font-bold text-black mb-2">
							24/7
						</div>
						<div className="text-gray-600">Support</div>
					</motion.div>
					<motion.div
						className="text-center"
						whileHover={{ scale: 1.1, y: -5 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<div className="text-4xl md:text-5xl font-bold text-black mb-2">
							Free
						</div>
						<div className="text-gray-600">Shipping</div>
					</motion.div>
				</motion.div>
			</motion.div>

			{/* Featured Categories - Centered */}
			<motion.div
				className="max-w-7xl mx-auto mb-20"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<motion.h2
					className="text-center text-black font-semibold text-4xl mb-12"
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
				>
					Featured Categories
				</motion.h2>
				<motion.div
					className="w-full relative"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<CategoriesSwiper categories={categories} />
				</motion.div>
			</motion.div>

			{/* Call to Action */}
			<motion.div
				className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 md:p-16 text-center mb-20"
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				whileHover={{ scale: 1.02 }}
			>
				<motion.h3
					className="text-white font-bold text-4xl md:text-5xl mb-6"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
				>
					Ready to Level Up?
				</motion.h3>
				<motion.p
					className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
				>
					Join thousands of gamers and professionals who trust our
					equipment for their daily victories.
				</motion.p>
				<motion.div
					className="flex flex-col sm:flex-row gap-4 justify-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					viewport={{ once: true }}
				>
					<motion.button
						className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.95 }}
					>
						Explore Products
					</motion.button>
					<motion.button
						className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-black transition-colors"
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.95 }}
					>
						View Deals
					</motion.button>
				</motion.div>
			</motion.div>

			{/* All Categories */}
			<motion.div
				className="max-w-7xl mx-auto"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<motion.h3
					className="text-black font-semibold text-3xl mb-10 text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					viewport={{ once: true }}
				>
					Shop All Product Categories
				</motion.h3>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<CategoriesList categories={categories} />
				</motion.div>
			</motion.div>
		</section>
	);
}
