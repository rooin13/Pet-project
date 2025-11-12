import { type RelationKey } from "@/entities/filter";

export const RELATION_TYPE: Record<RelationKey, "many" | "one"> = {
    brand: "one",
    connectivity: "many",
    miceFeatures: "many",
    handPreferences: "many",
    handSizes: "many",
    scrollTypes: "many",
    miceSeries: "many",

    colors: "many",
    keyboardLayouts: "many",
    keyboardExtras: "many",
    keyboardSeries: "many",

    webCamFeatures: "many",
    certified: "many",
    webcamResolution: "many",
    worksWith: "many",
};
