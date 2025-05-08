import { Controller, Get } from '@nestjs/common';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
  constructor(private absencesService: TypesService) {}

  @Get()
  getAbsences() {
    return this.absencesService.getTypes();
  }
}
