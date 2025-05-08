/*
  Warnings:

  - You are about to drop the column `nom` on the `Personnel` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Personnel` table. All the data in the column will be lost.
  - You are about to drop the column `total_cel` on the `Personnel` table. All the data in the column will be lost.
  - You are about to drop the column `total_cl` on the `Personnel` table. All the data in the column will be lost.
  - You are about to drop the column `total_jfr` on the `Personnel` table. All the data in the column will be lost.
  - You are about to drop the column `total_teletravail` on the `Personnel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pseudo]` on the table `Personnel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pseudo` to the `Personnel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Personnel_prenom_nom_key";

-- AlterTable
ALTER TABLE "Personnel" DROP COLUMN "nom",
DROP COLUMN "prenom",
DROP COLUMN "total_cel",
DROP COLUMN "total_cl",
DROP COLUMN "total_jfr",
DROP COLUMN "total_teletravail",
ADD COLUMN     "pseudo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AllowedHoliday" (
    "personnelId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "remainingDays" INTEGER DEFAULT 365,

    CONSTRAINT "AllowedHoliday_pkey" PRIMARY KEY ("personnelId","typeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_pseudo_key" ON "Personnel"("pseudo");

-- AddForeignKey
ALTER TABLE "AllowedHoliday" ADD CONSTRAINT "AllowedHoliday_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("prsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowedHoliday" ADD CONSTRAINT "AllowedHoliday_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AbsType"("typeId") ON DELETE RESTRICT ON UPDATE CASCADE;
