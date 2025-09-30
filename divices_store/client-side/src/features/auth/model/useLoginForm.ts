import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import type { LoginDataType } from "./types";
import type { SubmitHandler } from "react-hook-form";
import { authApi } from "@/shared/lib/api/auth/authApi";

export function useLoginForm(onSuccess: () => void) {
  const form = useForm<LoginDataType>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, setError, ...rest } = form;

  const onSubmit: SubmitHandler<LoginDataType> = async (data) => {
    try {
      await authApi.login(data.email, data.password);
      onSuccess();
    } catch (error: any) {
      setError("password", {
        type: "manual",
        message: error.message || "Invalid email or password",
      });
      setError("email", { type: "manual", message: "" });
    }
  };

  return {
    form,
    handleSubmit: handleSubmit(onSubmit),
    ...rest,
  };
}
