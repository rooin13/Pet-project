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
		<div>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button>
						<SearchIcon></SearchIcon>
					</button>
				</SheetTrigger>

				<SheetContent
					className="fixed top-0 left-0 w-full py-3 px-5 text-black bg-secondary border-black items-center justify-center z-50
	   								data-[state=open]:animate-[slide-in-top_0.3s_ease-out_forwards] data-[state=closed]:animate-[slide-out-top_0.3s_ease-in_forwards]"
					side="top"
				>
					<SheetHeader className="pb-50">
						<SheetTitle>
							<Search closeSheet={() => setOpen(false)} />
						</SheetTitle>
						<SheetDescription></SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	);
}
