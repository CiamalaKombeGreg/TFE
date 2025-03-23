/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TypesService {
    constructor(private prisma: PrismaService) {}

    getTypes() {
        return this.prisma.absType.findMany();
    }
}