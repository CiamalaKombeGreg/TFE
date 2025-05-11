/* eslint-disable prettier/prettier */
import { Controller, Get, Param} from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { Role } from '@prisma/client';

@Controller('personnel')
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Get(':id')
      getUserById(@Param('id') id: string){
          return this.personnelService.getIdByEmail(id);
    }
}

@Controller('personnelClass')
export class PersonnelClassController {
    constructor (private personnelService: PersonnelService) {}

    @Get(':id')
        getUserByClass(@Param('id') id: Role){
            return this.personnelService.getUsers(id)
    }
}