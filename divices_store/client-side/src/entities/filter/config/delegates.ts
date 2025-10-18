// src/features/filtration/model/config/delegates.ts
import { prisma } from "@/shared/lib/prisma/prisma";


export const RELATION_DELEGATES = {
    brand: prisma.brand,
    connectivity: prisma.connectivity,
    colors: prisma.color,
    miceFeatures: prisma.miceFeature,
    handPreferences: prisma.handPreference,
    handSizes: prisma.handSize,
    scrollTypes: prisma.advancedScrollType,
    miceSeries: prisma.miceSeries,
    keyboardLayouts: prisma.keyboardLayoutSize,
    keyboardExtras: prisma.keyboardExtraFeature,
    keyboardSeries: prisma.keyboardSeries,
    webCamFeatures: prisma.webCamFeature,
    certified: prisma.certifiedCompatibility,
    webcamResolution: prisma.resolutionFrameRate,
    worksWith: prisma.worksWith,
    platform: prisma.platform,
} as const;

export type RelationKey = keyof typeof RELATION_DELEGATES;