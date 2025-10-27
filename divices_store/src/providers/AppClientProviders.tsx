"use client";

import { useRef } from "react";
import { Providers as SessionProviders } from "@/providers/SessionProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "@/providers/StoreProvider";

export default function AppClientProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	// Используем useRef для стабильной ссылки на QueryClient
	const queryClientRef = useRef<QueryClient>();

	if (!queryClientRef.current) {
		queryClientRef.current = new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 60 * 1000,
					refetchOnWindowFocus: false,
				},
			},
		});
	}

	return (
		<SessionProviders>
			<QueryClientProvider client={queryClientRef.current}>
				<StoreProvider>{children}</StoreProvider>
			</QueryClientProvider>
		</SessionProviders>
	);
}
