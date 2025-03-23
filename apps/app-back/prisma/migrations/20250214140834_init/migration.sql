-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'RH', 'DEV', 'STAGIAIRE', 'COMPTABILITE');

-- CreateEnum
CREATE TYPE "AbsType" AS ENUM ('LEGAUX', 'EXTRA_LEGAUX', 'TELETRAVAIL', 'FERIE', 'SANSSOLDE', 'MALADIE', 'EXCEPTIONNEL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACCEPTER', 'REFUSER', 'ANALYSE', 'ANNULER');

-- CreateTable
CREATE TABLE "Personnel" (
    "prsId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role"[],
    "notifications" TEXT[],
    "total_cl" INTEGER,
    "total_cel" INTEGER,
    "total_teletravail" INTEGER,
    "total_jfr" INTEGER,

    CONSTRAINT "Personnel_pkey" PRIMARY KEY ("prsId")
);

-- CreateTable
CREATE TABLE "Absences" (
    "absId" TEXT NOT NULL,
    "type" "AbsType" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ANALYSE',
    "commentaire" TEXT NOT NULL,

    CONSTRAINT "Absences_pkey" PRIMARY KEY ("absId")
);

-- CreateTable
CREATE TABLE "Supervision" (
    "superviseurId" TEXT NOT NULL,
    "superviseId" TEXT NOT NULL,

    CONSTRAINT "Supervision_pkey" PRIMARY KEY ("superviseId","superviseurId")
);

-- CreateTable
CREATE TABLE "Conge" (
    "personnelId" TEXT NOT NULL,
    "absenceId" TEXT NOT NULL,

    CONSTRAINT "Conge_pkey" PRIMARY KEY ("personnelId","absenceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_email_key" ON "Personnel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_prenom_nom_key" ON "Personnel"("prenom", "nom");

-- AddForeignKey
ALTER TABLE "Supervision" ADD CONSTRAINT "Supervision_superviseurId_fkey" FOREIGN KEY ("superviseurId") REFERENCES "Personnel"("prsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervision" ADD CONSTRAINT "Supervision_superviseId_fkey" FOREIGN KEY ("superviseId") REFERENCES "Personnel"("prsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conge" ADD CONSTRAINT "Conge_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("prsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conge" ADD CONSTRAINT "Conge_absenceId_fkey" FOREIGN KEY ("absenceId") REFERENCES "Absences"("absId") ON DELETE RESTRICT ON UPDATE CASCADE;
