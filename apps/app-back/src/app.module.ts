/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AbsencesModule } from './absences/absences.module';

@Module({
  imports: [AbsencesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
