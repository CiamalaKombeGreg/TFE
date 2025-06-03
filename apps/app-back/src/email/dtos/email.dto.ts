import { IsEmail, IsString } from 'class-validator';

export class sendEmailDto {
  @IsEmail({}, { each: true })
  recipient: string;

  @IsEmail({}, { each: true })
  sender: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;
}
