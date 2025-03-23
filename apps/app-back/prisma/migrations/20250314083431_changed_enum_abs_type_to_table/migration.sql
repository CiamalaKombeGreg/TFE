/*
  Warnings:

  - You are about to drop the column `type` on the `Absences` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[typeId]` on the table `Absences` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `typeId` to the `Absences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Absences" DROP COLUMN "type",
ADD COLUMN     "typeId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AbsType";

-- CreateTable
CREATE TABLE "AbsType" (
    "typeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "AbsType_pkey" PRIMARY KEY ("typeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AbsType_label_key" ON "AbsType"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Absences_typeId_key" ON "Absences"("typeId");

-- AddForeignKey
ALTER TABLE "Absences" ADD CONSTRAINT "Absences_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AbsType"("typeId") ON DELETE RESTRICT ON UPDATE CASCADE;
