// файл: features/auth/model/useRegisterForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schema";
import type { RegisterDataType } from "./types";
import { useAppDispatch } from "@/store";
import { registerThunk } from "./slice";
import { SubmitHandler } from "react-hook-form";

export function useRegisterForm(onSuccess: () => void) {
    const dispatch = useAppDispatch();

    const form = useForm<RegisterDataType>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const { handleSubmit, setError, formState, ...rest } = form;
    const { isDirty } = formState;

    const onSubmit: SubmitHandler<RegisterDataType> = async (data) => {
        const action = await dispatch(registerThunk(data));
        if (registerThunk.rejected.match(action) && action.payload === 409) {

            setError("repeatPassword", {
                type: "manual",
                message: "This email is already used",
            });
            setError("email", { type: "manual", message: "" });
            return;
        }
        onSuccess();
    };

    return {
        form,
        handleSubmit: handleSubmit(onSubmit),
        isDirty,
    };
}
