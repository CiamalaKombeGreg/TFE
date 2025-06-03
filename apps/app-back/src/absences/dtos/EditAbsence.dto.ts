import { IsNotEmpty, IsString } from 'class-validator';

export class EditAbsenceDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  startDate: string | Date;

  @IsString()
  @IsNotEmpty()
  endDate: string | Date;
}
