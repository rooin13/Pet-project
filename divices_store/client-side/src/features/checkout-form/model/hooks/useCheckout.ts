import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthUser } from "@/features/auth/model/hooks";
import { useAppDispatch } from "@/store";
import { openModal } from "@/features/modal/model/modalSlice";
import { CheckoutForm, checkoutSchema } from "../validation";

export const useCheckout = () => {
    const { data: user, isPending: userLoading } = useAuthUser();
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            country: "United States",
            email: user?.email || "",
        },
    });

    const onSubmit = async (data: CheckoutForm, cartItems: any[], total: number) => {
        // check authentication
        if (!user) {
            alert("Please sign in to place an order");
            dispatch(openModal("login"));
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    cartItems,
                    total,
                }),
            });

            const result = await res.json();

            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                alert("Error: " + (result.error || "Failed to process checkout"));
            }
        } catch (err) {
            console.error(err);
            alert("Unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        user,
        userLoading,
        isSubmitting,
        form,
        onSubmit,
        dispatch,
    };
};

