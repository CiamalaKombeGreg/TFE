/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AbsencesService } from "./absences.service";
import { CreateAbsenceDto } from "./dtos/CreateAbsence.dto";

@Controller('absences')
export class AbsencesController {
    constructor(private absencesService: AbsencesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createUser(@Body() createAbsenceDto: CreateAbsenceDto) {
        return this.absencesService.createAbsence(createAbsenceDto)
    }
}