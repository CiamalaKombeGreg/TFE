/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TypesService {
    constructor(private prisma: PrismaService) {}

    async getTypes() {
        const types = await this.prisma.absType.findMany();

        if(types.length > 0){
            return types
        }else{
            return this.prisma.absType.createManyAndReturn({
                data: [
                    {label : "LEGAUX"},
                    {label : "EXTRA LEGAUX"},
                    {label : "SANS SOLDE"},
                    {label : "MALADIE"},
                    {label : "PATERNITE"},
                    {label : "MATERNITE"},
                    {label : "PARENTAL"},
                    {label : "ENFANT MALADE"},
                    {label : "ASSISTANCE MEDICALE"},
                    {label : "MALADIE PROLONGE"},
                    {label : "ACCIDENT PROFESSIONNEL"},
                    {label : "FORMATION"},
                    {label : "ADOPTION"},
                    {label : "SOINS PALLIATIFS"},
                    {label : "CIRCONSTANCE"},
                    {label : "IMPERIEUSE"}
                  ],
            })
        }
    }

    getTypeById(id : string) {
        return this.prisma.absType.findUnique({
            where : {
                typeId : id
            },
            select : {
                label : true
            }
        })
    }
}