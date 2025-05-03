/* eslint-disable prettier/prettier */
import { $Enums } from "@prisma/client";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAbsenceDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    typeId: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: Date | string;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date | string;

    @IsOptional()
    @IsDate()
    createAt?: Date | string;

    @IsOptional()
    @IsDate()
    updateAt?: Date | string;

    @IsOptional()
    status?: $Enums.Status;

    @IsString()
    @IsNotEmpty()
    commentaire: string;

    @IsString()
    @IsNotEmpty()
    personnelId: string;
}