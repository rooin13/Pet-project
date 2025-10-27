
import { Category, CATEGORY_FILTER_FIELD_MAP } from "@/entities/filter/config/filterFieldMap";
import { RelationKey } from "@/entities/filter/config/delegates";
import { RELATION_TYPE } from "../config/relationType";

// Маппинг URL slug → название категории в БД
const CATEGORY_NAME_MAP: Record<Category, string> = {
    mice: "Mice",
    keyboards: "Keyboards",
    headphones: "Headphones",
    webcams: "Webcams",
    mats: "Mats",
    bundle: "Bundle",
};

export function buildWhereClause(
    category: Category,
    query: string,
    filters: Record<string, string[]>
) {
    const categoryName = CATEGORY_NAME_MAP[category] || query;

    const where: any = {
        category: {
            name: {
                equals: categoryName,
                mode: "insensitive",
            },
        },
    };

    for (const [label, values] of Object.entries(filters)) {
        const relationKey = Object.entries(CATEGORY_FILTER_FIELD_MAP[category] || {}).find(
            ([key, val]) => val === label
        )?.[0] as RelationKey | undefined;

        if (!relationKey) continue;

        const relationType = RELATION_TYPE[relationKey];

        where[relationKey] =
            relationType === "many"
                ? { some: { name: { in: values } } }
                : { name: { in: values } };
    }

    return where;
}




export function buildIncludeClause(category: Category) {
    return {
        category: true,
        variations: true,
        ...Object.keys(CATEGORY_FILTER_FIELD_MAP[category] || {}).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>),
    };
}



export function buildFilterWhere(query: string, filters: Record<string, string[]>) {
    const category = query.toLowerCase() as Category;
    const categoryName = CATEGORY_NAME_MAP[category] || query;

    const where: any = {
        category: {
            name: {
                equals: categoryName,
                mode: "insensitive",
            },
        },
    };

    for (const [label, values] of Object.entries(filters)) {
        const relationKey = Object.entries(CATEGORY_FILTER_FIELD_MAP[category] || {}).find(
            ([key, val]) => val === label
        )?.[0];

        if (!relationKey) continue;

        const relationType = RELATION_TYPE[relationKey as keyof typeof RELATION_TYPE];

        where[relationKey] = relationType === "many"
            ? { some: { name: { in: values } } }
            : { name: { in: values } };
    }

    return where;
}
