import { MetadataRoute } from 'next'
import { prisma } from '@/shared/lib/prisma/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } })
    const base = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'

    return products.map(p => ({
        url: `${base}/product/${p.slug}`,
        lastModified: p.updatedAt,
    }))
}