/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AbsencesService } from "./absences.service";
import { CreateAbsenceDto } from "./dtos/CreateAbsence.dto";

@Controller('absences')
export class AbsencesController {
    constructor(private absencesService: AbsencesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    createAbsence(@Body() createAbsenceData: CreateAbsenceDto) {
        return this.absencesService.createAbsence(createAbsenceData)
    }

    @Get()
    getAbsences(){
        return this.absencesService.getAbsences();
    }

    @Get(':id')
    getAbsenceById(@Param('id') id: string){
        return this.absencesService.getAbsenceById(id);
    }

    @Delete(':id')
    deleteHolidayById(@Param('id') id: string){
        return this.absencesService.deleteAbsenceById(id)
    }
}