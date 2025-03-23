/*
  Warnings:

  - Added the required column `title` to the `Absences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Absences" ADD COLUMN     "title" TEXT NOT NULL;
