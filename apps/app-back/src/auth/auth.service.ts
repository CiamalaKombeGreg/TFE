import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenSchema } from '../schemas/auth';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getAuthResponse(data: {
    email: string;
    token: string;
    nom: string;
  }) {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${data.token}`,
      );
      const result = await response.json();

      console.log(result);

      if (
        typeof result === 'object' &&
        result !== null &&
        'iss' in result &&
        'aud' in result &&
        'exp' in result &&
        'email' in result &&
        'email_verified' in result &&
        'hd' in result
      ) {
        const validatedResult = TokenSchema.parse({
          iss: result.iss,
          aud: result.aud,
          exp: result.exp,
          email: result.email,
          email_verified: result.email_verified,
          hd: result.hd,
        });

        const findPersonnel = await this.prisma.personnel.findUnique({
          where: { email: validatedResult.email },
        });

        if (findPersonnel) {
          return { status: '200' };
        } else {
          return { status: '200', data: result };
        }
      } else {
        return { status: '401' };
      }
    } catch (error) {
      return { status: '500', error: error };
    }
  }
}
