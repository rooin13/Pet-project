import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { UseFormSetValue } from "react-hook-form";
import { CheckoutForm } from "../validation";

interface AddressSuggestion {
    display_name: string;
    address: {
        road?: string;
        house_number?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        postcode?: string;
        country?: string;
        building?: string;
    };
}

export const useAddressAutocomplete = (setValue: UseFormSetValue<CheckoutForm>) => {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [addressInput, setAddressInput] = useState("");
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // debounced search
    useEffect(() => {
        if (addressInput.length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(addressInput)}`,
                    {
                        headers: {
                            'User-Agent': 'HEX-Store-Checkout/1.0'
                        }
                    }
                );
                const data = await response.json();
                setSuggestions(data.slice(0, 5));
                setShowSuggestions(true);
            } catch (error) {
                console.error("Address search error:", error);
                setSuggestions([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [addressInput]);

    // close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectAddress = (suggestion: AddressSuggestion) => {
        const addr = suggestion.address;

        // build full address
        const street = [addr.house_number, addr.road, addr.building].filter(Boolean).join(" ");
        const city = addr.city || addr.town || addr.village || "";

        setValue("address", street || suggestion.display_name.split(",")[0]);
        setValue("city", city);
        setValue("state", addr.state || "");
        setValue("zipCode", addr.postcode || "");
        setValue("country", addr.country || "");

        setAddressInput(street || suggestion.display_name.split(",")[0]);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    return {
        suggestions,
        showSuggestions,
        setShowSuggestions,
        addressInput,
        setAddressInput,
        suggestionsRef,
        handleSelectAddress,
    };
};
