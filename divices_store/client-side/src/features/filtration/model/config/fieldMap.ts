import { RelationKey } from "./delegates";

export const CATEGORY_FILTER_FIELD_MAP: Record<string, Partial<Record<RelationKey, string>>> = {
    mice: {
        brand: "Manufacturer",
        connectivity: "Connection Type",
        miceFeatures: "Mouse Features",
        handPreferences: "Hand Preferences",
        handSizes: "Grip Size",
        scrollTypes: "Scroll Types",
        miceSeries: "Model Series",
    },
    keyboards: {
        brand: "Manufacturer",
        connectivity: "Connection Type",
        colors: "Available Colors",
        keyboardLayouts: "Layout & Size",
        keyboardExtras: "Extra Features",
        keyboardSeries: "Keyboard Series",
    },
    webcams: {
        webCamFeatures: "Webcam Features",
        certified: "Certified Compatibility",
        webcamResolution: "Resolution & FPS",
        worksWith: "Supported Platforms",
    },
    headphones: {
        brand: "Manufacturer",
        colors: "Available Colors",
    },
} satisfies Record<Category, Partial<Record<RelationKey, string>>>;

export type Category = keyof typeof CATEGORY_FILTER_FIELD_MAP;
