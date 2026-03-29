import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Conexão com o banco bem-sucedida! Total de usuários: ${userCount}`);
  } catch (error) {
    console.error('❌ Erro de conexão com o banco:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
