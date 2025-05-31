/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateSupervisionDto {
    @IsString()
    @IsNotEmpty()
    superviseId: string;
    
    @IsArray()
    supervisorIdList: string[];
}