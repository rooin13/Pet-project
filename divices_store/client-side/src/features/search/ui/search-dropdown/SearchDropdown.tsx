import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/Sheet";

import React, { useState } from "react";
import SearchIcon from "../search-icon/SearchIcon";
import { Search } from "../Search";
import useFocus from "@/shared/lib/hooks/useFocus";

export default function SearchDropdown() {
	const [open, setOpen] = useState(false);
	return (
		<div role="search">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						aria-label="Open search"
						aria-expanded={open}
						className="flex items-center justify-center"
					>
						<SearchIcon aria-hidden="true" />
					</button>
				</SheetTrigger>

				<SheetContent
					className="fixed top-0 left-0 w-full py-3 px-5 text-black bg-secondary border-black items-center justify-center z-50
	   								data-[state=open]:animate-[slide-in-top_0.3s_ease-out_forwards] data-[state=closed]:animate-[slide-out-top_0.3s_ease-in_forwards]"
					side="top"
					aria-label="Search panel"
				>
					<SheetHeader className="pb-50">
						<SheetTitle className="sr-only">
							Search Products
						</SheetTitle>
						<Search closeSheet={() => setOpen(false)} />
						<SheetDescription className="sr-only">
							Search for gaming products, keyboards, mice, and
							more
						</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	);
}
