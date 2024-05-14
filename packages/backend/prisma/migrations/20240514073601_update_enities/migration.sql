/*
  Warnings:

  - You are about to drop the column `ShipModelId` on the `decks` table. All the data in the column will be lost.
  - You are about to drop the column `PlayerModelId` on the `fields` table. All the data in the column will be lost.
  - You are about to drop the column `PlayerModelId` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `FieldModelId` on the `ships` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "decks" DROP CONSTRAINT "decks_ShipModelId_fkey";

-- DropForeignKey
ALTER TABLE "fields" DROP CONSTRAINT "fields_PlayerModelId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_PlayerModelId_fkey";

-- DropForeignKey
ALTER TABLE "ships" DROP CONSTRAINT "ships_FieldModelId_fkey";

-- AlterTable
ALTER TABLE "decks" DROP COLUMN "ShipModelId";

-- AlterTable
ALTER TABLE "fields" DROP COLUMN "PlayerModelId";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "PlayerModelId";

-- AlterTable
ALTER TABLE "ships" DROP COLUMN "FieldModelId";
