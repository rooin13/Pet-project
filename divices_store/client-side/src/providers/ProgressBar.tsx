"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBar() {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

		NProgress.start();
		const done = () => NProgress.done();

		done(); // сразу завершаем для первой загрузки
	}, []);

	useEffect(() => {
		NProgress.start();
		const timer = setTimeout(() => {
			NProgress.done();
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [pathname]);

	return null;
}
