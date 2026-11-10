import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Menjalankan database seed...');

  // Hapus data lama agar state awal konsisten
  await prisma.product.deleteMany();

  // Reset auto-increment sequence di PostgreSQL
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Product_id_seq" RESTART WITH 1;`
  );

  const products = [
    { name: 'Buku', price: 15000 },
    { name: 'Pulpen', price: 5000 },
  ];

  for (const item of products) {
    const product = await prisma.product.create({
      data: item,
    });
    console.log(`✅ Produk dibuat: [ID: ${product.id}] ${product.name} - Rp${product.price}`);
  }

  console.log('✨ Seed selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Gagal menjalankan seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
