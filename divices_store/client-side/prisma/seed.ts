import { slugifyName } from '../src/shared/lib/utils/slugify';
import { categories, products, variations } from '../src/shared/lib/prisma/data/product.data';
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
} from '../src/shared/lib/prisma/data/product.data';
import { id } from 'zod/v4/locales';

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
    // Delete all dependent records first to satisfy FK constraints
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.variation.deleteMany();

    // Disconnect all relations before deleting products
    await prisma.$executeRaw`UPDATE "Product" SET "brandId" = NULL`;
    await prisma.$executeRaw`DELETE FROM "_ProductColors"`;
    await prisma.$executeRaw`DELETE FROM "_ProductMiceSeries"`;
    await prisma.$executeRaw`DELETE FROM "_ProductKeyboardSeries"`;
    await prisma.$executeRaw`DELETE FROM "_ProductWebCamSeries"`;
    await prisma.$executeRaw`DELETE FROM "_ProductMiceFeatures"`;
    await prisma.$executeRaw`DELETE FROM "_ProductWebCamFeatures"`;
    await prisma.$executeRaw`DELETE FROM "_ProductCertified"`;
    await prisma.$executeRaw`DELETE FROM "_ProductHandPref"`;
    await prisma.$executeRaw`DELETE FROM "_ProductHandSizes"`;
    await prisma.$executeRaw`DELETE FROM "_ProductScrollTypes"`;
    await prisma.$executeRaw`DELETE FROM "_ProductConnectivity"`;
    await prisma.$executeRaw`DELETE FROM "_ProductPlatform"`;
    await prisma.$executeRaw`DELETE FROM "_ProductResolution"`;
    await prisma.$executeRaw`DELETE FROM "_ProductWorksWith"`;
    await prisma.$executeRaw`DELETE FROM "_ProductKeyboardLayouts"`;
    await prisma.$executeRaw`DELETE FROM "_ProductKeyboardExtras"`;

    // Now delete all products
    await prisma.product.deleteMany();

    console.log('✓ Cleaned up all existing data');


    await prisma.category.createMany({
        data: categories,
        skipDuplicates: true,
    });




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

    // Check for duplicate slugs
    const slugs = products.map(p => p.slug);
    const uniqueSlugs = new Set(slugs);
    if (slugs.length !== uniqueSlugs.size) {
        console.error(`ERROR: Found duplicate slugs!`);
        const slugCounts = new Map<string, number>();
        slugs.forEach(slug => slugCounts.set(slug, (slugCounts.get(slug) || 0) + 1));
        const duplicates = Array.from(slugCounts.entries()).filter(([_, count]) => count > 1);
        duplicates.forEach(([slug, count]) => {
            const productIds = products.filter(p => p.slug === slug).map(p => p.id);
            console.error(`  - slug "${slug}" appears ${count} times in products with IDs: ${productIds.join(', ')}`);
        });
    }

    // Create products one by one with upsert to ensure they exist with correct IDs
    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            create: {
                id: p.id,
                slug: p.slug,
                name: p.name,
                description: p.description,
                price: p.price,
                imagesUrl: p.imagesUrl as Prisma.InputJsonValue,
                categoryId: p.categoryId,
                brandId: p.brandId ?? undefined,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            },
            update: {
                name: p.name,
                description: p.description,
                price: p.price,
                imagesUrl: p.imagesUrl as Prisma.InputJsonValue,
                categoryId: p.categoryId,
                brandId: p.brandId ?? undefined,
                updatedAt: p.updatedAt,
            },
        });
    }
    console.log(`✓ Created/updated ${products.length} products`);

    console.log(`Total products: ${products.length}`);
    console.log(`Total variations to create: ${variations.length}`);

    // Check if all variation productIds exist in products
    const productIds = new Set(products.map(p => p.id));
    const invalidVariations = variations.filter(v => !productIds.has(v.productId));

    if (invalidVariations.length > 0) {
        console.error('Invalid variations found (productId not in products):');
        invalidVariations.forEach(v => {
            console.error(`  - Variation id ${v.id} references non-existent productId ${v.productId}`);
        });
        throw new Error(`Found ${invalidVariations.length} variations with invalid productIds`);
    }

    // Get actual product IDs from DB to compare
    const dbProducts = await prisma.product.findMany({ select: { id: true, slug: true } });
    const dbProductIds = new Set(dbProducts.map(p => p.id));

    console.log(`Products in DB: ${dbProducts.length}, IDs: [${Array.from(dbProductIds).sort((a, b) => a - b).slice(0, 10).join(', ')}...]`);

    for (const v of variations) {
        if (!dbProductIds.has(v.productId)) {
            console.error(`ERROR: Variation ${v.id} references productId ${v.productId} which doesn't exist in DB!`);
            console.error(`Available product IDs: ${Array.from(dbProductIds).sort((a, b) => a - b).join(', ')}`);
            throw new Error(`Invalid productId ${v.productId} in variation ${v.id}`);
        }

        await prisma.variation.create({
            data: {
                productId: v.productId,
                color: v.color,
                size: v.size,
                price: v.price,
            },
        });
    }



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