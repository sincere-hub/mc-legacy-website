import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma";

async function main() {
  const email = "admin@mclegacy.co.za";
  const password = "ChangeMe123!";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      name: "MC Legacy Administrator",
      role: "ADMIN",
      isActive: true,
      passwordHash,
    },

    create: {
      name: "MC Legacy Administrator",
      email,
      phone: null,
      role: "ADMIN",
      isActive: true,
      passwordHash,
    },
  });

  console.log("Admin created:");
  console.log(admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });