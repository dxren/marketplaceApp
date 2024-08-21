-- CreateTable
CREATE TABLE "FavoriteAsk" (
    "userId" TEXT NOT NULL,
    "askId" TEXT NOT NULL,

    CONSTRAINT "FavoriteAsk_pkey" PRIMARY KEY ("userId","askId")
);

-- CreateTable
CREATE TABLE "FavoriteOffer" (
    "userId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,

    CONSTRAINT "FavoriteOffer_pkey" PRIMARY KEY ("userId","offerId")
);

-- AddForeignKey
ALTER TABLE "FavoriteAsk" ADD CONSTRAINT "FavoriteAsk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAsk" ADD CONSTRAINT "FavoriteAsk_askId_fkey" FOREIGN KEY ("askId") REFERENCES "Ask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteOffer" ADD CONSTRAINT "FavoriteOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteOffer" ADD CONSTRAINT "FavoriteOffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
