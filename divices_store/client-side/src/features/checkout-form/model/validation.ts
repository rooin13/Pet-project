import * as z from "zod";

export const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),

    address: z.string().min(5, "Address is required"),
    zipCode: z.string().min(3, "ZIP code is required"),

    cardNumber: z.string().min(19, "Invalid card number").optional(),
    expiry: z.string().min(5, "Invalid expiry").optional(),
    cvv: z.string().min(3, "Invalid CVV").optional(),
});


export type CheckoutForm = z.infer<typeof checkoutSchema>;
