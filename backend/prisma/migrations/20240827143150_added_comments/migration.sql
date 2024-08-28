-- CreateTable
CREATE TABLE "AskComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "askId" TEXT NOT NULL,
    "parent_typeId" TEXT,

    CONSTRAINT "AskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "parent_typeId" TEXT,

    CONSTRAINT "OfferComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AskComment" ADD CONSTRAINT "AskComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskComment" ADD CONSTRAINT "AskComment_askId_fkey" FOREIGN KEY ("askId") REFERENCES "Ask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AskComment" ADD CONSTRAINT "AskComment_parent_typeId_fkey" FOREIGN KEY ("parent_typeId") REFERENCES "AskComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferComment" ADD CONSTRAINT "OfferComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferComment" ADD CONSTRAINT "OfferComment_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferComment" ADD CONSTRAINT "OfferComment_parent_typeId_fkey" FOREIGN KEY ("parent_typeId") REFERENCES "OfferComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
