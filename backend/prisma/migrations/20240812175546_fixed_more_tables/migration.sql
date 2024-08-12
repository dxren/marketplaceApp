/*
  Warnings:

  - You are about to drop the column `askId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `offerId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Ask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_askId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_offerId_fkey";

-- AlterTable
ALTER TABLE "Ask" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "askId",
DROP COLUMN "offerId";

-- AddForeignKey
ALTER TABLE "Ask" ADD CONSTRAINT "Ask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
