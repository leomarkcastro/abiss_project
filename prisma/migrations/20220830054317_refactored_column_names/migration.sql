/*
  Warnings:

  - You are about to drop the column `userId` on the `Abi` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Program` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Abi" DROP CONSTRAINT "Abi_userId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_userId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_userId_fkey";

-- AlterTable
ALTER TABLE "Abi" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Abi" ADD CONSTRAINT "Abi_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
