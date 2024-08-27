/*
  Warnings:

  - You are about to drop the `AskComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OfferComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AskComment" DROP CONSTRAINT "AskComment_askId_fkey";

-- DropForeignKey
ALTER TABLE "AskComment" DROP CONSTRAINT "AskComment_parent_typeId_fkey";

-- DropForeignKey
ALTER TABLE "AskComment" DROP CONSTRAINT "AskComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "OfferComment" DROP CONSTRAINT "OfferComment_offerId_fkey";

-- DropForeignKey
ALTER TABLE "OfferComment" DROP CONSTRAINT "OfferComment_parent_typeId_fkey";

-- DropForeignKey
ALTER TABLE "OfferComment" DROP CONSTRAINT "OfferComment_userId_fkey";

-- DropTable
DROP TABLE "AskComment";

-- DropTable
DROP TABLE "OfferComment";

-- CreateTable
CREATE TABLE "AskOfferComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "askId" TEXT,
    "offerId" TEXT,
    "parent_typeId" TEXT,

    CONSTRAINT "AskOfferComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AskOfferComment" ADD CONSTRAINT "AskOfferComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskOfferComment" ADD CONSTRAINT "AskOfferComment_askId_fkey" FOREIGN KEY ("askId") REFERENCES "Ask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskOfferComment" ADD CONSTRAINT "AskOfferComment_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskOfferComment" ADD CONSTRAINT "AskOfferComment_parent_typeId_fkey" FOREIGN KEY ("parent_typeId") REFERENCES "AskOfferComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
