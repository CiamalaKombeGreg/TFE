/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PersonnelService {
    constructor(private prisma: PrismaService) {}

    getIdByEmail(email: string) {
        return this.prisma.personnel.findUnique({
            where: {
                email
            },
            select: {
                prsId: true
            }
        });
    }

    getUsers(){
        return this.prisma.personnel.findMany();
    }
}