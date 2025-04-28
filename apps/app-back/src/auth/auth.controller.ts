import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  create(
    @Body() data: { email: string; token: string; prenom: string; nom: string },
  ) {
    return this.authService.getAuthResponse(data);
  }
}
