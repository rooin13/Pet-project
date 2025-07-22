import { prisma } from '../prisma/prisma'
async function main() {
  try {
    // Простой запрос, чтобы проверить, работает ли база
    const devices = await prisma.product.findMany()
    console.log('✅ Успешно подключено. Найдено устройств:', devices.length)
  } catch (error) {
    console.error('❌ Ошибка подключения к Prisma:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
