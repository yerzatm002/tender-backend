-- AlterTable
ALTER TABLE "Tender" ADD COLUMN     "supplierId" TEXT;

-- AddForeignKey
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
