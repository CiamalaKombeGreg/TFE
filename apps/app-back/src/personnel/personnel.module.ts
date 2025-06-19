/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PersonnelController, PersonnelClassController, SupervisionController, PersonnelIdController } from './personnel.controller';
import { PrismaModule } from "src/prisma/prisma.module";
import { PersonnelService } from "./personnel.service";

@Module({
  imports: [PrismaModule],
  controllers: [PersonnelController, PersonnelClassController, SupervisionController, PersonnelIdController],
  providers: [PersonnelService],
})
export class PersonnelModule {}