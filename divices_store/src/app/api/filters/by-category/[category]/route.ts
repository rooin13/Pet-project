// import { prisma } from "@/shared/lib/prisma/prisma"
// import { NextRequest, NextResponse } from "next/server"

// const CATEGORY_FILTER_FIELD_MAP = {
//   mice: {
//     brand: "Manufacturer",
//     connectivity: "Connection Type",
//     miceFeatures: "Mouse Features",
//     handPreferences: "Hand Preferences",
//     handSizes: "Grip Size",
//     scrollTypes: "Scroll Types",
//     miceSeries: "Model Series",
//   },
//   keyboards: {
//     brand: "Manufacturer",
//     connectivity: "Connection Type",
//     colors: "Available Colors",
//     keyboardLayouts: "Layout & Size",
//     keyboardExtras: "Extra Features",
//     keyboardSeries: "Keyboard Series",
//   },
//   webcams: {
//     webCamFeatures: "Webcam Features",
//     certified: "Certified Compatibility",
//     webcamResolution: "Resolution & FPS",
//     worksWith: "Supported Platforms",
//   },
//   headphones: {
//     brand: "Manufacturer",
//     colors: "Available Colors",
//   },
// } as const

// const RELATION_DELEGATES = {
//   brand: prisma.brand,
//   connectivity: prisma.connectivity,
//   colors: prisma.color,
//   miceFeatures: prisma.miceFeature,
//   handPreferences: prisma.handPreference,
//   handSizes: prisma.handSize,
//   scrollTypes: prisma.advancedScrollType,
//   miceSeries: prisma.miceSeries,
//   keyboardLayouts: prisma.keyboardLayoutSize,
//   keyboardExtras: prisma.keyboardExtraFeature,
//   keyboardSeries: prisma.keyboardSeries,
//   webCamFeatures: prisma.webCamFeature,
//   certified: prisma.certifiedCompatibility,
//   webcamResolution: prisma.resolutionFrameRate,
//   worksWith: prisma.worksWith,
// } as const

// type RelationKey = keyof typeof RELATION_DELEGATES

// interface Params {
//   params: { category: string }
// }

// export async function GET(_req: NextRequest, { params }: Params) {
//   const category = params.category.toLowerCase().trim()

//   if (!(category in CATEGORY_FILTER_FIELD_MAP)) {
//     return NextResponse.json({ error: "Invalid category" }, { status: 400 })
//   }

//   const fieldsMap = CATEGORY_FILTER_FIELD_MAP[category as keyof typeof CATEGORY_FILTER_FIELD_MAP] as Record<RelationKey, string>

//   const queries = (Object.keys(fieldsMap) as RelationKey[]).map(async (relation) => {
//     const delegate = RELATION_DELEGATES[relation] as {
//       findMany: (args: any) => Promise<{ name: string }[]>
//     }

//     const items = await delegate.findMany({
//       where: {
//         products: {
//           some: {
//             category: {
//               is: { name: { equals: category, mode: "insensitive" } },
//             },
//           },
//         },
//       },
//       distinct: ["name"],
//       select: { name: true },
//     })

//     return {
//       relation,
//       title: fieldsMap[relation],
//       items,
//     }
//   })

//   const rawResults = await Promise.all(queries)

//   const result: { field: RelationKey; title: string; label: string }[] = []

//   for (const { relation, title, items } of rawResults) {
//     for (const { name } of items) {
//       result.push({
//         field: relation,
//         title,
//         label: name,
//       })
//     }
//   }

//   return NextResponse.json(result)
// }

// export async function OPTIONS() {
//   return new NextResponse(null, { status: 204 })
// }
