import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenSchema } from '../schemas/auth';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getAuthResponse(data: { email: string; token: string; nom: string }) {
    if (
      process.env.GOOGLE_ANDROID_CLIENT === undefined ||
      process.env.GOOGLE_IOS_CLIENT === undefined
    ) {
      return {
        status: 500,
        message: 'No google client provided in environment.',
      };
    }

    const client = new OAuth2Client();

    try {
      const ticket = await client.verifyIdToken({
        idToken: data.token,
        audience: [
          process.env.GOOGLE_ANDROID_CLIENT,
          process.env.GOOGLE_IOS_CLIENT,
        ],
      });
      const payload = ticket.getPayload();

      if (!payload) {
        return {
          status: 401,
          message:
            'Unauthorized with no payload received while verifying token.',
        };
      }

      const userId = payload['sub'];

      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${userId}`,
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
          return {
            status: '200',
            message: 'This email is already in registered.',
          };
        } else {
          return {
            status: '200',
            message: 'This email has been added to the personnel.',
          };
        }
      } else {
        return {
          status: '500',
          message: "Token infos doesn't match what is asked in.",
        };
      }
    } catch (error) {
      return { status: '500', error: error };
    }
  }
}
