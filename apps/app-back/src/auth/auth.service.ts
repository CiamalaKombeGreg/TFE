/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getAuthResponse(data: { email: string; token: string; nom: string }) {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${data.token}`,
      );
      const result = await response.json();

      if (
        typeof result === 'object' &&
        result !== null &&
        'email' in result &&
        typeof result.email === 'string'
      ) {
        const findPersonnel = await this.prisma.personnel.findUnique({
          where: { email: result.email },
          select: {
            conges: true,
          }
        });

        if (findPersonnel) {
          return {
            status: '200',
            message: 'This email is already in registered.',
          };
        } else {
          await this.prisma.personnel.create({
            data: {
              pseudo: data.nom,
              email: data.email,
              role: ["DEV"]
            },
          });
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
