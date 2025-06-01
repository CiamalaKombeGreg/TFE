/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from "@nestjs/common";
import { Prisma, Status } from "@prisma/client";
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
            return this.prisma.absences.create({ data })
        }else{
            return {error: "Le type n'existe pas"}
        }
    }

    getAbsences() {
        return this.prisma.absences.findMany();
    }

    getAbsenceById(id: string) {
        return this.prisma.absences.findUnique({
            where: {
                absId: id
            },
        });
    }

    async deleteAbsenceById(id: string){
        const findHoliday = await this.getAbsenceById(id);
        if(!findHoliday) throw new HttpException("Holiday was not found", 404);
        return this.prisma.absences.delete({
            where: {
                absId: id
            }
        })
    }

    async updateAbsenceById({id, comment, status} : {id : string, comment : string, status : Status}){
        const findHoliday = await this.getAbsenceById(id);
        if(!findHoliday) throw new HttpException("Holiday was not found", 404);
        console.log(comment)
        return this.prisma.absences.update({
            where: {
                absId: id
            },
            data : {
                status : status
            }
        })
    }
}