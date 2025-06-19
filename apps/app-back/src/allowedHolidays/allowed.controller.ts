import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AllowedService } from './allowed.service';

@Controller('allowed')
export class AllowedController {
  constructor(private allowedService: AllowedService) {}

  @Get(':id')
  getRelatedAllowedHolidays(@Param('id') id: string) {
    return this.allowedService.getAllowedHolidaysById(id);
  }

  @Post()
  create(
    @Body()
    data: {
      personnelId: string;
      allowedHolidays: {
        remainingDays: number;
        typeId: string;
      }[];
    },
  ) {
    return this.allowedService.updateRemainingDays(data);
  }
}
