/*
  Warnings:

  - You are about to drop the `Conge` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `personnelId` to the `Absences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conge" DROP CONSTRAINT "Conge_absenceId_fkey";

-- DropForeignKey
ALTER TABLE "Conge" DROP CONSTRAINT "Conge_personnelId_fkey";

-- AlterTable
ALTER TABLE "Absences" ADD COLUMN     "personnelId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Conge";

-- AddForeignKey
ALTER TABLE "Absences" ADD CONSTRAINT "Absences_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("prsId") ON DELETE RESTRICT ON UPDATE CASCADE;
