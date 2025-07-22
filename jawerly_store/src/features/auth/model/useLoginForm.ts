// файл: features/auth/model/useLoginForm.ts
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { loginThunk } from "./slice";
import { SubmitHandler } from "react-hook-form";

import type { LoginDataType } from "./types";


export function useLoginForm(onSuccess: () => void) {
    const dispatch = useAppDispatch();

    const form = useForm<LoginDataType>({
        resolver: zodResolver(loginSchema),
    });

    const { handleSubmit, setError, ...rest } = form;

    const onSubmit: SubmitHandler<LoginDataType> = async (data) => {
        const action = await dispatch(loginThunk(data));
        if (loginThunk.rejected.match(action) && action.payload === 400) {

            setError("password", {
                type: "manual",
                message: "Invalid email or password",
            });
            setError("email", { type: "manual", message: "" });
            return;
        }
        onSuccess();
    };

    return {
        form,          // всё, что возвращает useForm (register, errors, etc.)
        handleSubmit: handleSubmit(onSubmit),
    };
}
