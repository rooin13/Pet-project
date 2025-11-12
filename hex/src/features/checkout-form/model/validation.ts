import * as z from "zod";

export const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),

    address: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().optional(),
    zipCode: z.string().min(3, "ZIP/Postal code is required"),
    country: z.string().min(2, "Country is required"),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;
