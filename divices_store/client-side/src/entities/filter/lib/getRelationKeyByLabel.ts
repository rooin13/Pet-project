import { CATEGORY_FILTER_FIELD_MAP, Category } from "../config/fieldMap";
import { RelationKey } from "../config/delegates"

// Возвращает обратный маппинг: "Connection Type" → "connectivity"
export function getRelationKeyByLabel(category: Category) {
    const map = CATEGORY_FILTER_FIELD_MAP[category];
    const result: Record<string, RelationKey> = {};

    for (const [relationKey, label] of Object.entries(map)) {
        if (label) result[label] = relationKey as RelationKey;
    }

    return result;
}