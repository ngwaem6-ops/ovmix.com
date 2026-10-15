import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // Hash demo passwords
  const merchantPassword = await bcrypt.hash("password123", 10);
  const customerPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "merchant@ovmix.com" },
    update: {},
    create: {
      name: "Demo Merchant",
      email: "merchant@ovmix.com",
      password: merchantPassword,
      role: "merchant",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@ovmix.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@ovmix.com",
      password: customerPassword,
      role: "customer",
    },
  });

  const products = [
    {
      name: "OVMix Ceramic Mug",
      slug: "ovmix-ceramic-mug",
      description: "Premium ceramic mug, 12oz.",
      price: 1599,
      image: "/images/mug.jpg",
    },
    {
      name: "OVMix Tote Bag",
      slug: "ovmix-tote-bag",
      description: "Reusable tote bag — carry everything.",
      price: 2499,
      image: "/images/tote.jpg",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
