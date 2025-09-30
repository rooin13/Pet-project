
import { RELATION_DELEGATES, RelationKey } from "../config/delegates";
import { Category } from "../config/filterFieldMap";
import { DelegateType } from "../../../features/filtration/model/types";

export async function getOptionsForRelation(
    relation: RelationKey,
    category: Category
): Promise<{ label: string; value: string }[]> {
    const delegate = RELATION_DELEGATES[relation] as unknown as DelegateType;

    const items = await delegate.findMany({
        where: {
            products: {
                some: {
                    category: {
                        is: { name: { equals: category, mode: "insensitive" } },
                    },
                },
            },
        },
        distinct: ["name"],
        select: { name: true },
    });

    return items.map((item) => ({ label: item.name, value: item.name }));
}
