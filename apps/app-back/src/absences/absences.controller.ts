/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AbsencesService } from "./absences.service";
import { EmailService } from "src/email/email.service";
import { CreateAbsenceDto } from "./dtos/CreateAbsence.dto";
import { UpdateAbsenceDto } from "./dtos/UpdateAbsence.dto";
import { EditAbsenceDto } from "./dtos/EditAbsence.dto";

@Controller('absences')
export class AbsencesController {
    constructor(private absencesService: AbsencesService, private emailService: EmailService ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createAbsence(@Body() createAbsenceData: CreateAbsenceDto) {
        const emailData = await this.absencesService.createAbsence(createAbsenceData);
        if(emailData.error){
            return {status : 500, message : "An error occured"}
        }else{
            for(const email of emailData.recipients){
                await this.emailService.sendEmail({ recipient: email, sender: emailData.sender, subject: `Une nouvelle demande de congé en attente : ${emailData.title}`, html: `Bonjour, ce mail a été automatiquement envoyé par l'application getaway depuis le courriel de ${emailData.sender}.` });
            }
        }

        return {status : 200, message : 'Succeeded'}
    }

    @Get()
    getAbsences(){
        return this.absencesService.getAbsences();
    }

    @Get(':id')
    getAbsenceById(@Param('id') id: string){
        return this.absencesService.getAbsenceById(id);
    }

    @Get('related/:id')
    getRelatedAbsenceByEmail(@Param('id') id: string){
        return this.absencesService.getUserAbsences(id);
    }

    @Get('owner/:id')
    getOwnerEmailById(@Param('id') id: string){
        return this.absencesService.getAbsenceOwnerById(id);
    }

    @Delete(':id')
    deleteHolidayById(@Param('id') id: string){
        return this.absencesService.deleteAbsenceById(id);
    }

    @Post('status')
    updateHolidayById(@Body() updateAbsenceData: UpdateAbsenceDto){
        return this.absencesService.updateAbsenceById({email : updateAbsenceData.email, id : updateAbsenceData.id, comment : updateAbsenceData.comment, status : updateAbsenceData.status});
    }

    @Post('edit')
    editHoliday(@Body() editAbsenceData : EditAbsenceDto){
        return this.absencesService.editAbsence({id : editAbsenceData.id, comment : editAbsenceData.comment, startDate : editAbsenceData.startDate, endDate : editAbsenceData.endDate});
    }
}