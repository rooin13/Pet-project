// файл: features/auth/model/useLoginForm.ts
import { useForm } from "react-hook-form";


import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { SubmitHandler } from "react-hook-form";

import type { LoginDataType } from "./types";
import { useLogin } from "@/features/auth/model/hooks";
import { isAxiosError } from "axios";


export function useLoginForm(onSuccess: () => void) {

    const form = useForm<LoginDataType>({
        resolver: zodResolver(loginSchema),
    });

    const { handleSubmit, setError, ...rest } = form;

    const loginMutation = useLogin();

    const onSubmit: SubmitHandler<LoginDataType> = (data) => {
        loginMutation.mutate(data, {
            onSuccess: () => {
                onSuccess()
            },
            onError: (error) => {
                if (isAxiosError(error)) {
                    if (error?.response?.status === 400) {
                        setError("password", {
                            type: "manual",
                            message: "Invalid email or password",
                        });
                        setError("email", { type: "manual", message: "" });
                    }

                } else {
                    console.error("Unexpected error:", error);
                }
            },
        });
    };


    return {
        form,
        handleSubmit: handleSubmit(onSubmit),
    };
}
