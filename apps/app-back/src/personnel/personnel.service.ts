/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
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

    getUsers(role: Role | "ALL"){
        if(role === "ALL"){
            return this.prisma.personnel.findMany()
        }

        return this.prisma.personnel.findMany({
            where: {
                role: {
                    has: role
                }
            },
        })
    }
}