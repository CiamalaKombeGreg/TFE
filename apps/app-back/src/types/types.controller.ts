import { Controller, Get, Param } from '@nestjs/common';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}

  @Get()
  getTypes() {
    return this.typesService.getTypes();
  }

  @Get(':id')
  getTypeById(@Param('id') id: string) {
    return this.typesService.getTypeById(id);
  }
}
