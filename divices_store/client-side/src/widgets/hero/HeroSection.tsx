"use client";

import { motion } from "framer-motion";

export const HeroSection = () => {
	return (
		<section
			id="keyboard-section"
			style={{
				marginLeft: "calc(50% - 50vw)",
				marginRight: "calc(50% - 49.6vw)",
			}}
			className={`
        relative
        grid
        grid-rows-[auto_auto]
        grid-cols-1        /* мобильно — 1 колонка */
        lg:grid-cols-3     /* на больших экранах — 3 колонки */
        gap-y-6            /* меньше вертикальный gap на мобилке */
        lg:gap-y-12
        pb-20              /* меньше паддинг снизу на мобилке */
        lg:pb-[400px]
      `}
		>
			{/* Анимированный фон */}
			<motion.div className="absolute inset-0 bg-[url('/images/razer-back.webp')] bg-cover bg-center -z-10" />

			{/* Верхний заголовок */}
			<motion.div
				className="col-span-1 lg:col-span-3 flex justify-center"
				initial={{ opacity: 0, y: -30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				viewport={{ once: false, amount: 0.3 }}
			>
				<h2
					className={`
            text-white
            text-3xl sm:text-4xl md:text-5xl lg:text-7xl
            mb-6 sm:mb-12 lg:mb-40
            text-center
          `}
				>
					Design for sustainability. Everything matters.
				</h2>
			</motion.div>

			{/* Левый нижний заголовок */}
			<div className="col-span-1 overflow-hidden max-w-full lg:max-w-3xl px-2 sm:px-4">
				<motion.div
					className="p-2 sm:p-4 rounded-lg"
					initial={{ opacity: 0, x: -50 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.9, delay: 0.5 }}
					viewport={{ once: false, amount: 0.2 }}
				>
					<h2
						className={`
              text-2xl sm:text-3xl md:text-4xl lg:text-8xl
              text-left
              text-transparent bg-clip-text
              bg-gradient-to-br from-[#1b1f25] via-white/80 to-[#1b1f25]
            `}
					>
						New Start. New Gear. Success Starts Here.
					</h2>
				</motion.div>
			</div>

			{/* Правый нижний заголовок */}
			<div className="col-start-1 lg:col-start-3 overflow-hidden max-w-full lg:max-w-3xl flex justify-end px-2 sm:px-4">
				<motion.div
					className="items-center"
					initial={{ opacity: 0, x: 50 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.9, delay: 0.1 }}
					viewport={{ once: false, amount: 0.3 }}
				>
					<h2
						className={`
              text-2xl sm:text-3xl md:text-4xl lg:text-8xl
              text-right
              text-transparent bg-clip-text
              bg-gradient-to-br from-[#111418] via-white/60 to-[#111418]
            `}
					>
						The #1 Headset used by Esports Pros
					</h2>
				</motion.div>
			</div>
		</section>
	);
};
