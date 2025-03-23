/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AbsencesService {
    constructor(private prisma: PrismaService) {}

    async createAbsence(data: Prisma.AbsencesCreateManyInput) {
        const foundId = await this.prisma.absType.findUnique({
            where: {
                typeId: data.typeId,
            },
        });
        if(foundId){
            console.log("le type existe")
            return this.prisma.absences.create({ data })
        }else{
            console.log("le type n'existe pas")
            return {error: "Le type n'existe pas"}
        }
    }

    getAbsences() {
        return this.prisma.absences.findMany();
    }

    getAbsenceByType() {}

    getAbsenceById() {}

    getAbsenceByPersonnel() {}
}