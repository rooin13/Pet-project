import { slugifyName } from '../src/shared/lib/utils/slugify';
import { categories, products, variations } from '../src/shared/lib/data/product.data';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import {
    colors as colorsConst,
    brands as brandsConst,
    miceSeries as miceSeriesConst,
    keyboardSeries as keyboardSeriesConst,
    webCamSeries as webCamSeriesConst,
    miceFeatures as miceFeaturesConst,
    webCamFeatures as webCamFeaturesConst,
    certified as certifiedConst,
    handPreferences as handPreferencesConst,
    handSizes as handSizesConst,
    scrollTypes as scrollTypesConst,
    connectivity as connectivityConst,
    platform as platformConst,
    webcamResolution as webcamResConst,
    worksWith as worksWithConst,
    keyboardLayouts as keyboardLayoutsConst,
    keyboardExtras as keyboardExtrasConst,
} from '../src/shared/lib/data/product.data';

const prisma = new PrismaClient();

async function main() {
    try {
        // await down()
        await up()
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect();
    }
}
async function up() {
    await prisma.user.createMany({
        data: [{ fullName: 'John Doe', email: 'john@example.com', password: hashSync('password123', 10), verified: new Date() },
        {
            fullName: 'Janifer Doe', email: 'jenifer@example.com', password: hashSync('password123', 10), verified: new Date()
        }
        ],
        skipDuplicates: true,

    },)
    await prisma.category.createMany({
        data: categories,
        skipDuplicates: true,
    });


    await prisma.cart.createMany({
        data: [
            {
                id: 1,
                totalAmount: 0,
                userId: 1,
                token: "228337"
            },
            {
                id: 2,
                totalAmount: 0,
                userId: 2,
                token: "337228"
            }
        ],
        skipDuplicates: true,
    })


    await prisma.color.createMany({ data: [...colorsConst] as Prisma.ColorCreateManyInput[], skipDuplicates: true });
    await prisma.brand.createMany({ data: [...brandsConst] as Prisma.BrandCreateManyInput[], skipDuplicates: true });
    await prisma.miceSeries.createMany({ data: [...miceSeriesConst] as Prisma.MiceSeriesCreateManyInput[], skipDuplicates: true });
    await prisma.keyboardSeries.createMany({ data: [...keyboardSeriesConst] as Prisma.KeyboardSeriesCreateManyInput[], skipDuplicates: true });
    await prisma.webCamSeries.createMany({ data: [...webCamSeriesConst] as Prisma.WebCamSeriesCreateManyInput[], skipDuplicates: true });
    await prisma.miceFeature.createMany({ data: [...miceFeaturesConst] as Prisma.MiceFeatureCreateManyInput[], skipDuplicates: true });
    await prisma.webCamFeature.createMany({ data: [...webCamFeaturesConst] as Prisma.WebCamFeatureCreateManyInput[], skipDuplicates: true });
    await prisma.certifiedCompatibility.createMany({ data: [...certifiedConst] as Prisma.CertifiedCompatibilityCreateManyInput[], skipDuplicates: true });
    await prisma.handPreference.createMany({ data: [...handPreferencesConst] as Prisma.HandPreferenceCreateManyInput[], skipDuplicates: true });
    await prisma.handSize.createMany({ data: [...handSizesConst] as Prisma.HandSizeCreateManyInput[], skipDuplicates: true });
    await prisma.advancedScrollType.createMany({ data: [...scrollTypesConst] as Prisma.AdvancedScrollTypeCreateManyInput[], skipDuplicates: true });
    await prisma.connectivity.createMany({ data: [...connectivityConst] as Prisma.ConnectivityCreateManyInput[], skipDuplicates: true });
    await prisma.platform.createMany({ data: [...platformConst] as Prisma.PlatformCreateManyInput[], skipDuplicates: true });
    await prisma.resolutionFrameRate.createMany({ data: [...webcamResConst] as Prisma.ResolutionFrameRateCreateManyInput[], skipDuplicates: true });
    await prisma.worksWith.createMany({ data: [...worksWithConst] as Prisma.WorksWithCreateManyInput[], skipDuplicates: true });
    await prisma.keyboardLayoutSize.createMany({ data: [...keyboardLayoutsConst] as Prisma.KeyboardLayoutSizeCreateManyInput[], skipDuplicates: true });
    await prisma.keyboardExtraFeature.createMany({ data: [...keyboardExtrasConst] as Prisma.KeyboardExtraFeatureCreateManyInput[], skipDuplicates: true });

    await prisma.product.createMany({
        data: products.map(p => ({
            slug: p.slug,
            name: p.name,
            description: p.description,
            price: p.price,
            imagesUrl: p.imagesUrl as Prisma.InputJsonValue,
            categoryId: p.categoryId,
            brandId: p.brandId ?? undefined,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        })),
        skipDuplicates: true,
    });

    await prisma.variation.createMany({
        data: variations.map((v: typeof variations[number]) => ({
            productId: v.productId,
            color: v.color,
            size: v.size,
            price: v.price,
        })),
        skipDuplicates: true,
    });



    await prisma.cartItem.createMany(
        {
            data: [
                {
                    id: 1,
                    variationId: 3,
                    cartId: 1,
                    quantity: 2
                },
                {
                    id: 2,
                    variationId: 4,
                    cartId: 2,
                    quantity: 2
                }
            ],
            skipDuplicates: true,

        }

    )

    const ops: Prisma.PrismaPromise<any>[] = [];

    for (const p of products) {
        const cleanArray = (arr: any[] | undefined) =>
            (arr ?? []).filter((x): x is { id: number } => x?.id != null);

        ops.push(
            prisma.product.update({
                where: { slug: p.slug },
                data: {
                    colors: { connect: cleanArray(p.colors).map(c => ({ id: c.id })) },
                    connectivity: { connect: cleanArray(p.connectivity).map(c => ({ id: c.id })) },
                    miceFeatures: { connect: cleanArray(p.miceFeatures).map(c => ({ id: c.id })) },
                    webCamFeatures: { connect: cleanArray(p.webCamFeatures).map(c => ({ id: c.id })) },
                    handPreferences: { connect: cleanArray(p.handPreferences).map(c => ({ id: c.id })) },
                    handSizes: { connect: cleanArray(p.handSizes).map(c => ({ id: c.id })) },
                    scrollTypes: { connect: cleanArray(p.scrollTypes).map(c => ({ id: c.id })) },
                    platform: { connect: cleanArray(p.platform).map(c => ({ id: c.id })) },
                    webcamResolution: { connect: cleanArray(p.webcamResolution).map(c => ({ id: c.id })) },
                    worksWith: { connect: cleanArray(p.worksWith).map(c => ({ id: c.id })) },
                    keyboardLayouts: { connect: cleanArray(p.keyboardLayouts).map(c => ({ id: c.id })) },
                    keyboardExtras: { connect: cleanArray(p.keyboardExtras).map(c => ({ id: c.id })) },
                    miceSeries: { connect: cleanArray(p.miceSeries).map(c => ({ id: c.id })) },
                    keyboardSeries: { connect: cleanArray(p.keyboardSeries).map(c => ({ id: c.id })) },
                    webCamSeries: { connect: cleanArray(p.webCamSeries).map(c => ({ id: c.id })) },
                    certified: { connect: cleanArray(p.certified).map(c => ({ id: c.id })) },

                },
            })
        );
    }
    await prisma.$transaction(ops);


}



export async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "ProductVariation" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Variation" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
}

main().then(async () => {
    await prisma.$disconnect();

}).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });