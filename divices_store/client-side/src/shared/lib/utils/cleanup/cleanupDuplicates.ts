import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        orderBy: { updatedAt: 'desc' }
    })
    const seen = new Set<string>()
    for (const user of users) {
        if (seen.has(user.email)) {
            await prisma.user.delete({ where: { id: user.id } })
        } else {
            seen.add(user.email)
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())