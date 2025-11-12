import { prisma } from "@/shared/lib/prisma/prisma";
import { slugifyName } from "@/shared/lib";

async function main() {
    const products = await prisma.product.findMany();

    for (const product of products) {
        const slug = slugifyName(product.name);

        await prisma.product.update({
            where: { id: product.id },
            data: { slug },
        });

        console.log(`✅ ${product.name} → ${slug}`);
    }
}

main()
    .then(() => {
        console.log("All slugs generated.");
        process.exit(0);
    })
    .catch((e) => {
        console.error("Error generating slugs", e);
        process.exit(1);
    });
