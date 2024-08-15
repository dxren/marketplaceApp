/*
  Warnings:

  - Added the required column `title` to the `Ask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ask" ADD COLUMN     "title" TEXT;
UPDATE "Ask" SET "title" = 'Default Value';
ALTER TABLE "Ask" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "title" TEXT;
UPDATE "Offer" SET "title" = 'Default Value';
ALTER TABLE "Offer" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biography" TEXT NOT NULL DEFAULT '';
