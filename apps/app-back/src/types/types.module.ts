/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { TypesService } from "./types.service";
import { TypesController } from "./types.controller";

@Module({
    imports: [PrismaModule],
    controllers: [TypesController],
    providers: [TypesService],
})

export class TypesModule {}