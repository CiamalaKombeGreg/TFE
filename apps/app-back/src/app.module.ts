/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AbsencesModule } from './absences/absences.module';
import { TypesModule } from './types/types.module';

@Module({
  imports: [AbsencesModule, TypesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
