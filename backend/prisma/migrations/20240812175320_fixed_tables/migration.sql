/*
  Warnings:

  - You are about to drop the column `socialsValue` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `Socials` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `Socials` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_socialsValue_fkey";

-- DropIndex
DROP INDEX "Socials_value_key";

-- AlterTable
ALTER TABLE "Socials" ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Socials_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "socialsValue";

-- AddForeignKey
ALTER TABLE "Socials" ADD CONSTRAINT "Socials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
