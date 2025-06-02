/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AbsencesService } from "./absences.service";
import { AbsencesController } from "./absences.controller";
import { EmailService } from "src/email/email.service";

@Module({
    imports: [PrismaModule],
    controllers: [AbsencesController],
    providers: [AbsencesService, EmailService],
})

export class AbsencesModule {}