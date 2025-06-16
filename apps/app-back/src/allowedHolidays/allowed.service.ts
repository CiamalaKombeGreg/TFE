import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AllowedService {
  constructor(private prisma: PrismaService) {}

  async getAllowedHolidaysById(id: string) {
    // Verify if types are missing
    const types = await this.prisma.absType.findMany({
      select: {
        typeId: true,
      },
    });

    const allowedHolidays = await this.prisma.allowedHoliday.findMany({
      where: {
        personnelId: id,
      },
    });

    // List to add new type
    const allowedData: { personnelId: string; typeId: string }[] = [];

    for (const type of types) {
      let haveAnExistingType = false;
      for (const allowedHoliday of allowedHolidays) {
        if (type.typeId === allowedHoliday.typeId) {
          haveAnExistingType = true;
          break;
        }
      }
      if (!haveAnExistingType) {
        allowedData.push({ personnelId: id, typeId: type.typeId });
      }
    }

    // Add new types if they weren't there
    if (allowedData.length > 0) {
      await this.prisma.allowedHoliday.createMany({
        data: allowedData,
      });
    }

    return await this.prisma.allowedHoliday.findMany({
      where: {
        personnelId: id,
      },
    });
  }

  updateRemainingDays(data: {
    remainingDays: number;
    personnelId: string;
    typeId: string;
  }) {
    return this.prisma.allowedHoliday.update({
      data: {
        remainingDays: data.remainingDays,
      },
      where: {
        personnelId_typeId: {
          personnelId: data.personnelId,
          typeId: data.typeId,
        },
      },
    });
  }
}
