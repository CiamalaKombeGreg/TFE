import { Module } from '@nestjs/common';
import { AbsencesModule } from './absences/absences.module';
import { TypesModule } from './types/types.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AbsencesModule, TypesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
