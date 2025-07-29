import { RELATION_DELEGATES } from "../../../entities/filter/config/delegates";
import { CATEGORY_FILTER_FIELD_MAP } from "../../../entities/filter/config/fieldMap";

export interface FilterOption {
    field: string;
    title: string;
    label: string;
}

export interface FilterGroupProps {
    title: string;
    options: { label: string; value: string }[];
}


export type DelegateType = {
    findMany: (args: {
        where: any;
        distinct: string[];
        select: { name: true };
    }) => Promise<{ name: string }[]>;
};
