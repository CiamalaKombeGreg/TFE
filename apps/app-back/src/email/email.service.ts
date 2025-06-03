/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './dtos/email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('APP_PASSWORD'),
      },
    });

    return transporter;
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipient, sender, subject, html } = dto;

    const transporter = this.emailTransport();

    try {
      await transporter.sendMail({
        from: sender,
        to: recipient,
        subject: subject,
        html: html,
      });
    } catch (error) {
      console.log(error);
      return {
        message: 'An error occured during the email sending',
        status: 500,
      };
    }
    return { message: 'Email was send.', status: 200 };
  }
}
