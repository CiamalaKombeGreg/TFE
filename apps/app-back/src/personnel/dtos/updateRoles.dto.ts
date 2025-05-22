/* eslint-disable prettier/prettier */
import { Role } from "@prisma/client";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateRolesDto {
    @IsString()
    @IsNotEmpty()
    email: string;
    
    @IsArray()
    @IsNotEmpty()
    roles: Role[];
}