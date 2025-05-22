/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { Role } from '@prisma/client';
import { UpdateRolesDto } from './dtos/updateRoles.dto';

@Controller('personnelById')
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Get(':id')
      getUserById(@Param('id') id: string){
          return this.personnelService.getIdByEmail(id);
    }
}

@Controller('personnel')
export class PersonnelClassController {
    constructor (private personnelService: PersonnelService) {}

    @Get()
        getUserByClass(){
            return this.personnelService.getUsers()
    }

    @Post('roles')
    @UsePipes(ValidationPipe)
    updateUserRoles(@Body() updateUserRoles : UpdateRolesDto){
        return this.personnelService.updateUserRoles(updateUserRoles)
    }
}