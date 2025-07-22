import { CATEGORY_FILTER_FIELD_MAP, Category } from "./config/fieldMap";
import { RelationKey } from "./config/delegates";
import { FilterGroupProps } from "./types";
import { getOptionsForRelation } from "./getOptionsForRelation";

export async function getFiltersByCategory(
    categoryRaw: string
): Promise<FilterGroupProps[]> {
    const category = categoryRaw.toLowerCase().trim() as Category;

    if (!(category in CATEGORY_FILTER_FIELD_MAP)) {
        throw new Error(`Invalid category: ${category}`);
    }

    const fieldsMap = CATEGORY_FILTER_FIELD_MAP[category]!;
    const results: FilterGroupProps[] = [];

    for (const relation of Object.keys(fieldsMap) as RelationKey[]) {
        const title = fieldsMap[relation];
        if (!title) continue;

        const options = await getOptionsForRelation(relation, category);
        if (options.length) {
            results.push({ title, options });
        }
    }

    return results;
}
