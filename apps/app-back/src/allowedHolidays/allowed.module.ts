import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AllowedController } from './allowed.controller';
import { AllowedService } from './allowed.service';

@Module({
  imports: [PrismaModule],
  controllers: [AllowedController],
  providers: [AllowedService],
})
export class AllowedModule {}
