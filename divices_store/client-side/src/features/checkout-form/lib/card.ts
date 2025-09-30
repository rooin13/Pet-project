import CardValidator from "card-validator";

export type CardType = "visa" | "mastercard" | null;

export function getCardType(number: string): CardType {
    const validation = CardValidator.number(number);
    if (validation.card) {
        if (validation.card.type === "visa") return "visa";
        if (validation.card.type === "mastercard") return "mastercard";
    }
    return null;
}
