// Seed: cria um usuário admin para testar o sistema
// Execute com: npm run prisma:seed
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@faculdade.edu.br';
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (exists) {
    console.log('Admin já existe, nada a fazer.');
    return;
  }

  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: adminEmail,
      password,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário admin criado:');
  console.log(`   email:    ${admin.email}`);
  console.log('   senha:    admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
