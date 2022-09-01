/*
  Warnings:

  - You are about to drop the `Abi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Network` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Abi" DROP CONSTRAINT "Abi_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_abiID_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_networkID_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_ownerId_fkey";

-- DropTable
DROP TABLE "Abi";

-- DropTable
DROP TABLE "Contract";

-- DropTable
DROP TABLE "Network";

-- DropTable
DROP TABLE "Program";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "XABI_User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "type" INTEGER,

    CONSTRAINT "XABI_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XABI_Abi" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "abi" TEXT NOT NULL,
    "ownerId" INTEGER,

    CONSTRAINT "XABI_Abi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XABI_Network" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "XABI_Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XABI_Contract" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "abiID" INTEGER,
    "networkID" INTEGER,
    "ownerId" INTEGER,

    CONSTRAINT "XABI_Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XABI_Program" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contractId" TEXT,
    "ownerId" INTEGER,

    CONSTRAINT "XABI_Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "XABI_User_email_key" ON "XABI_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "XABI_Network_name_key" ON "XABI_Network"("name");

-- CreateIndex
CREATE UNIQUE INDEX "XABI_Contract_name_key" ON "XABI_Contract"("name");

-- CreateIndex
CREATE UNIQUE INDEX "XABI_Program_key_key" ON "XABI_Program"("key");

-- CreateIndex
CREATE UNIQUE INDEX "XABI_Program_name_key" ON "XABI_Program"("name");

-- AddForeignKey
ALTER TABLE "XABI_Abi" ADD CONSTRAINT "XABI_Abi_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "XABI_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XABI_Contract" ADD CONSTRAINT "XABI_Contract_abiID_fkey" FOREIGN KEY ("abiID") REFERENCES "XABI_Abi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XABI_Contract" ADD CONSTRAINT "XABI_Contract_networkID_fkey" FOREIGN KEY ("networkID") REFERENCES "XABI_Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XABI_Contract" ADD CONSTRAINT "XABI_Contract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "XABI_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XABI_Program" ADD CONSTRAINT "XABI_Program_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "XABI_Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XABI_Program" ADD CONSTRAINT "XABI_Program_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "XABI_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
