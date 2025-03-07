/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AbsencesService {
    constructor(private prisma: PrismaService) {}

    createAbsence(data: Prisma.AbsencesCreateInput) {
        return this.prisma.absences.create({ data })
    }

    getAbsences() {}

    getAbsenceByType() {}

    getAbsenceById() {}

    getAbsenceByPersonnel() {}
}