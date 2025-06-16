import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class EnumsService {
  constructor(private prisma: PrismaService) {}

  getRoles() {
    return Role;
  }
}
