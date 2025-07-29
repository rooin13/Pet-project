import { CATEGORY_FILTER_FIELD_MAP, Category } from "../config/fieldMap";
import { RelationKey } from "../config/delegates";
import { FilterGroupProps } from "../../../features/filtration/model/types";
import { getOptionsForRelation } from "./getOptionsForRelation";

export async function getFiltersByCategory(
    categoryRaw: string
): Promise<FilterGroupProps[]> {
    const category = categoryRaw.toLowerCase().trim() as Category;
    const fieldsMap = CATEGORY_FILTER_FIELD_MAP[category]!;

    const relations = Object.entries(fieldsMap) as [RelationKey, string][];

    const filterGroups = await Promise.all(
        relations.map(async ([relation, title]) => {
            const options = await getOptionsForRelation(relation, category);
            return options.length ? { title, options } : null;
        })
    );

    return filterGroups.filter(Boolean) as FilterGroupProps[];
}
