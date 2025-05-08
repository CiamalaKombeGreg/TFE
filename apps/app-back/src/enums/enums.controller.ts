import { Controller, Get } from '@nestjs/common';
import { EnumsService } from './enums.service';

@Controller('enums/roles')
export class EnumsController {
  constructor(private EnumsService: EnumsService) {}

  @Get()
  getRoles() {
    return this.EnumsService.getRoles();
  }
}
