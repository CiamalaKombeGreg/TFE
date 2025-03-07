/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { $Enums, Prisma } from "@prisma/client";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAbsenceDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    type: $Enums.AbsType;

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

    @IsOptional()
    conges?: Prisma.CongeCreateNestedManyWithoutAbsenceInput;
}