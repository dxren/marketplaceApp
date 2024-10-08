import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      //   { displayName: "Alice Johnson", email: "alice.johnson@example.com" },
      //   { displayName: "Bob Smith", email: "bob.smith@example.com" },
      //   { displayName: "Charlie Brown", email: "charlie.brown@example.com" },
    ],
  });

  const offers = await prisma.offer.createMany({
    data: [
      {
        title: 'Graphic Design',
        description: "Offering graphic design services",
        createdAt: new Date(),
        userId: "1",
      },
      {
        title: 'Web Development',
        description: "Offering web development services",
        createdAt: new Date(),
        userId: "2",
      },
      {
        title: 'Project Management',
        description: "Offering project management services",
        createdAt: new Date(),
        userId: "3",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
