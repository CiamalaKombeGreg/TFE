/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { UpdateRolesDto } from './dtos/updateRoles.dto';
import { UpdateSupervisionDto } from './dtos/updateSupervision.dto';

@Controller('personnelById')
export class PersonnelController {
  constructor(private personnelService: PersonnelService) {}

  @Get(':id')
      getIdByEmail(@Param('id') id: string){
          return this.personnelService.getIdByEmail(id);
    }
}

@Controller('personnelID')
export class PersonnelIdController {
    constructor(private personnelService: PersonnelService) {}

    @Get(':id')
    getUserById(@Param('id') id: string){
        return this.personnelService.getUserById(id);
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

    @Get('admin/:id')
    getAdminByEmail(@Param('id') id: string){
        return this.personnelService.getAdmin(id);
    }
}

@Controller('supervision')
export class SupervisionController {
    constructor (private personnelService : PersonnelService){}

    @Post('create')
    @UsePipes(ValidationPipe)
    createSupervision(@Body() updateSupervision : UpdateSupervisionDto){
        return this.personnelService.updateSupervision({superviseId : updateSupervision.superviseId, supervisorIdList : updateSupervision.supervisorIdList})
    }
}