import { Module } from '@nestjs/common';
import { AbsencesModule } from './absences/absences.module';
import { TypesModule } from './types/types.module';
import { AuthModule } from './auth/auth.module';
import { PersonnelModule } from './personnel/personnel.module';
import { EnumsModule } from './enums/enums.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { AllowedModule } from './allowedHolidays/allowed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AbsencesModule,
    TypesModule,
    AuthModule,
    PersonnelModule,
    EnumsModule,
    EmailModule,
    UploadModule,
    AllowedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
