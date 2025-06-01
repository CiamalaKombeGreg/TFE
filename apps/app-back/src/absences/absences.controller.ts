/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AbsencesService } from "./absences.service";
import { CreateAbsenceDto } from "./dtos/CreateAbsence.dto";
import { UpdateAbsenceDto } from "./dtos/UpdateAbsence.dto";
import { EditAbsenceDto } from "./dtos/EditAbsence.dto";

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

    @Post('status')
    updateHolidayById(@Body() updateAbsenceData: UpdateAbsenceDto){
        return this.absencesService.updateAbsenceById({email : updateAbsenceData.email, id : updateAbsenceData.id, comment : updateAbsenceData.comment, status : updateAbsenceData.status})
    }

    @Post('edit')
    editHoliday(@Body() editAbsenceData : EditAbsenceDto){
        return this.absencesService.editAbsence({id : editAbsenceData.id, comment : editAbsenceData.comment, startDate : editAbsenceData.startDate, endDate : editAbsenceData.endDate})
    }
}