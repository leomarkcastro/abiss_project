/*
  Warnings:

  - You are about to drop the `XABI_Abi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `XABI_Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `XABI_Network` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `XABI_Program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `XABI_User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "XABI_Abi" DROP CONSTRAINT "XABI_Abi_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "XABI_Contract" DROP CONSTRAINT "XABI_Contract_abiID_fkey";

-- DropForeignKey
ALTER TABLE "XABI_Contract" DROP CONSTRAINT "XABI_Contract_networkID_fkey";

-- DropForeignKey
ALTER TABLE "XABI_Contract" DROP CONSTRAINT "XABI_Contract_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "XABI_Program" DROP CONSTRAINT "XABI_Program_contractId_fkey";

-- DropForeignKey
ALTER TABLE "XABI_Program" DROP CONSTRAINT "XABI_Program_ownerId_fkey";

-- DropTable
DROP TABLE "XABI_Abi";

-- DropTable
DROP TABLE "XABI_Contract";

-- DropTable
DROP TABLE "XABI_Network";

-- DropTable
DROP TABLE "XABI_Program";

-- DropTable
DROP TABLE "XABI_User";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "type" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abi" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "abi" TEXT NOT NULL,
    "ownerId" INTEGER,

    CONSTRAINT "Abi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Network" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "abiID" INTEGER,
    "networkID" INTEGER,
    "ownerId" INTEGER,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contractId" TEXT,
    "ownerId" INTEGER,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Network_name_key" ON "Network"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_name_key" ON "Contract"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_key_key" ON "Program"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- AddForeignKey
ALTER TABLE "Abi" ADD CONSTRAINT "Abi_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_abiID_fkey" FOREIGN KEY ("abiID") REFERENCES "Abi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_networkID_fkey" FOREIGN KEY ("networkID") REFERENCES "Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
