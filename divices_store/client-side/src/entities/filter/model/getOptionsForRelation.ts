
import { RELATION_DELEGATES, RelationKey } from "../config/delegates";
import { Category } from "../config/filterFieldMap";
import { DelegateType } from "../../../features/filtration/model/types";

// Маппинг URL slug → название категории в БД
const CATEGORY_NAME_MAP: Record<Category, string> = {
    mice: "Mice",
    keyboards: "Keyboards",
    headphones: "Headphones",
    webcams: "Webcams",
    mats: "Mats",
    bundle: "Bundle",
};

export async function getOptionsForRelation(
    relation: RelationKey,
    category: Category
): Promise<{ label: string; value: string }[]> {
    const delegate = RELATION_DELEGATES[relation] as unknown as DelegateType;
    const categoryName = CATEGORY_NAME_MAP[category] || category;

    const items = await delegate.findMany({
        where: {
            products: {
                some: {
                    category: {
                        is: { name: { equals: categoryName, mode: "insensitive" } },
                    },
                },
            },
        },
        distinct: ["name"],
        select: { name: true },
    });

    return items.map((item) => ({ label: item.name, value: item.name }));
}
