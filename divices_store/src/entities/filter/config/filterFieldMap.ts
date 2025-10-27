import { RelationKey } from "./delegates";

export const CATEGORY_FILTER_FIELD_MAP: Record<string, Partial<Record<RelationKey, string>>> = {
    mice: {
        brand: "Brand",
        connectivity: "Connection Type",
        miceFeatures: "Mouse Features",
        handPreferences: "Hand Preferences",
        handSizes: "Grip Size",
        scrollTypes: "Scroll Types",
        miceSeries: "Model Series",
        platform: "Platform",
    },
    keyboards: {
        brand: "Brand",
        connectivity: "Connection Type",
        colors: "Available Colors",
        keyboardLayouts: "Layout & Size",
        keyboardExtras: "Extra Features",
        keyboardSeries: "Keyboard Series",
        platform: "Platform",
    },
    webcams: {
        brand: "Brand",
        webCamFeatures: "Webcam Features",
        certified: "Certified Compatibility",
        webcamResolution: "Resolution & FPS",
        worksWith: "Supported Platforms",
        platform: "Platform",
        connectivity: "Connection Type",
    },
    headphones: {
        brand: "Brand",
        colors: "Available Colors",
        connectivity: "Connection Type",
    },
    mats: {
        brand: "Brand",
        colors: "Available Colors",
    },
    bundle: {
        brand: "Brand",
        colors: "Available Colors",
    },
} satisfies Record<Category, Partial<Record<RelationKey, string>>>;

export type Category = keyof typeof CATEGORY_FILTER_FIELD_MAP;
