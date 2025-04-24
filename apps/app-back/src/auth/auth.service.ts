import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getAuthResponse(data: { email: string; token: string }) {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${data.token}`,
      );
      const result = await response.json();

      if (!result) {
        return { status: '401' };
      }

      const findPersonnel = await this.prisma.personnel.findUnique({
        where: { email: data.email },
      });

      if (findPersonnel) {
        return { status: '200' };
      } else {
        return { status: '200', data: result };
      }
    } catch (error) {
      return { status: '500', error: error };
    }
  }
}
