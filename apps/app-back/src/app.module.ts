import { Module } from '@nestjs/common';
import { AbsencesModule } from './absences/absences.module';
import { TypesModule } from './types/types.module';
import { AuthModule } from './auth/auth.module';
import { PersonnelModule } from './personnel/personnel.module';
import { EnumsModule } from './enums/enums.module';

@Module({
  imports: [
    AbsencesModule,
    TypesModule,
    AuthModule,
    PersonnelModule,
    EnumsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
