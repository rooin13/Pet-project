import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { registerSchema } from "./schema";
import type { RegisterDataType } from "./types";

export function useRegisterForm(onSuccess: () => void) {
    const form = useForm<RegisterDataType>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const { handleSubmit, setError, ...rest } = form;

    const onSubmit: SubmitHandler<RegisterDataType> = async (data) => {
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const resJson = await res.json();

            if (!res.ok) {
                if (resJson.error === "Email already in use") {
                    setError("email", { type: "manual", message: "Email уже занят" });
                } else if (resJson.error === "Missing fields") {
                    setError("email", { type: "manual", message: "Заполните все поля" });
                }
                return;
            }


            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError("password", { type: "manual", message: "Ошибка входа после регистрации" });
                return;
            }
            onSuccess();
        } catch (err) {
            console.error("Register error:", err);
        }
    };

    return {
        form,
        handleSubmit: handleSubmit(onSubmit),
        ...rest,
    };
}
