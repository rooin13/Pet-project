	"use client";
	import { useAppSelector } from "@/store";
	import { LoginForm } from "@/features/auth/ui/LoginForm";
	import { RegisterForm } from "@/features/auth/ui/RegisterForm";

	export const ModalRenderer = () => {
		const { isOpen, modalType } = useAppSelector((state) => state.modal);

		if (!isOpen) return null;

		switch (modalType) {
			case "login":
				return <LoginForm />;
			case "register":
				return <RegisterForm />;
			default:
				return "";
		}
	};
