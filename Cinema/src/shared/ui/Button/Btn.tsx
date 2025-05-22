export const Btn = (text: string, style: string, onclick: () => void) => {
	const handleClick = () => {
		if (onclick) {
			onclick();
		}
	};
	return (
		<button
			onClick={handleClick}
			className={`flex justify-center items-center flex-grow-0 flex-shrink-0 py-2 relative gap-3 px-12 py- rounded-[28px] 
				 cursor-pointer bg-primary  hover:bg-primary-hover transition-colors duration-300  ${
						"bg-" + style
					}`}
		>
			<span className="flex-grow-0 flex-shrink-0 text-lg font-light text-left text-white">
				{text}
			</span>
		</button>
	);
};
