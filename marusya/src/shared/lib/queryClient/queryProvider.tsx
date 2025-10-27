// src/shared/lib/reactQueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
	// create queryClient only on client side
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{" "}
			{children}{" "}
		</QueryClientProvider>
	);
}
