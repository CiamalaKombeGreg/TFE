/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { sendEmailDto } from "./dtos/email.dto";

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) {}

    @Post('send')
    async SendmailTransport(@Body() dto: sendEmailDto){
        return this.emailService.sendEmail(dto);
    }
}