/* eslint-disable prettier/prettier */
import { Status } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateAbsenceDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    comment: string;
    
    @IsString()
    @IsNotEmpty()
    @IsEnum(Status)
    status: Status;
}