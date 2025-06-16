import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EnumsService } from './enums.service';
import { EnumsController } from './enums.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EnumsController],
  providers: [EnumsService],
})
export class EnumsModule {}
