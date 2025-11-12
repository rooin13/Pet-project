import { useGetCartQuery } from "@/shared/lib/api/cart/cartApi";
import { calculateShipping, calculateOrderTotal } from "@/shared/lib";

export const useCart = () => {
    const { data: cart, isLoading, isError } = useGetCartQuery();

    const cartItems = cart?.items ?? [];
    const subtotal = cart?.totalAmount ?? 0;
    const shipping = calculateShipping(subtotal);
    const total = calculateOrderTotal(subtotal);

    return {
        cart,
        cartItems,
        subtotal,
        shipping,
        total,
        isLoading,
        isError,
        isEmpty: cartItems.length === 0,
    };
};

