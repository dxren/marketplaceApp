/*
  Warnings:

  - You are about to drop the column `parent_typeId` on the `AskOfferComment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AskOfferComment" DROP CONSTRAINT "AskOfferComment_askId_fkey";

-- DropForeignKey
ALTER TABLE "AskOfferComment" DROP CONSTRAINT "AskOfferComment_offerId_fkey";

-- DropForeignKey
ALTER TABLE "AskOfferComment" DROP CONSTRAINT "AskOfferComment_parent_typeId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteAsk" DROP CONSTRAINT "FavoriteAsk_askId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteOffer" DROP CONSTRAINT "FavoriteOffer_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_userId_fkey";

-- AlterTable
ALTER TABLE "AskOfferComment" DROP COLUMN "parent_typeId",
ADD COLUMN     "commentId" TEXT;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAsk" ADD CONSTRAINT "FavoriteAsk_askId_fkey" FOREIGN KEY ("askId") REFERENCES "Ask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteOffer" ADD CONSTRAINT "FavoriteOffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskOfferComment" ADD CONSTRAINT "AskOfferComment_askId_fkey" FOREIGN KEY ("askId") REFERENCES "Ask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskOfferComment" ADD CONSTRAINT "AskOfferComment_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskOfferComment" ADD CONSTRAINT "AskOfferComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "AskOfferComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
