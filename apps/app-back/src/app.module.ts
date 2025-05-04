import { Module } from '@nestjs/common';
import { AbsencesModule } from './absences/absences.module';
import { TypesModule } from './types/types.module';
import { AuthModule } from './auth/auth.module';
import { PersonnelModule } from './personnel/personnel.module';

@Module({
  imports: [AbsencesModule, TypesModule, AuthModule, PersonnelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
