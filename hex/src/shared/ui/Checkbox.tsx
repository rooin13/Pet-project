"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

function Checkbox({
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className="flex size-[18px] shrink-0 mr-3 appearance-none items-center justify-center rounded bg-white shadow-[0_0_2px] shadow-blackA4 outline-none hover:bg-primary  data-[state=checked]:bg-primary 
				data-[state=checked]:text-white`, "
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="flex border-black   items-center justify-center text-black transition-none"
			>
				<CheckIcon className="size-3.5" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
