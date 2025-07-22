// файл: features/auth/model/useRegisterForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schema";
import type { RegisterDataType } from "./types";
import { SubmitHandler } from "react-hook-form";
import { useRegister } from "./hooks";
import { AxiosError, isAxiosError } from "axios";

export function useRegisterForm(onSuccess: () => void) {


    const form = useForm<RegisterDataType>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const { handleSubmit, setError, formState, ...rest } = form;
    const { isDirty } = formState;

    const registerMutation = useRegister();
    const onSubmit: SubmitHandler<RegisterDataType> = (data) => {
        registerMutation.mutate(data, {
            onSuccess: () => {
                onSuccess();
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

                    else {
                        console.error("Unexpected error:", error);
                    }
                }
            },
        });
    };

    return {
        form,
        handleSubmit: handleSubmit(onSubmit),
        isDirty,
    };
}
