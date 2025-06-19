import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AllowedService {
  constructor(private prisma: PrismaService) {}

  async getAllowedHolidaysById(id: string) {
    // Working id
    let usedId = id;

    // Test if it is an id or an email
    const user = await this.prisma.personnel.findUnique({
      where: {
        prsId: usedId,
      },
    });

    if (!user) {
      const userByEmail = await this.prisma.personnel.findUnique({
        where: {
          email: usedId,
        },
        select: {
          prsId: true,
        },
      });

      if (userByEmail) {
        usedId = userByEmail.prsId;
      }
    }

    // Verify if types are missing
    const types = await this.prisma.absType.findMany({
      select: {
        typeId: true,
      },
    });

    const allowedHolidays = await this.prisma.allowedHoliday.findMany({
      where: {
        personnelId: usedId,
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
        allowedData.push({ personnelId: usedId, typeId: type.typeId });
      }
    }

    // Add new types if they weren't there
    if (allowedData.length > 0) {
      await this.prisma.allowedHoliday.createMany({
        data: allowedData,
      });
    }

    const fetched = await this.prisma.allowedHoliday.findMany({
      where: {
        personnelId: usedId,
      },
    });

    return fetched;
  }

  async updateRemainingDays(data: {
    personnelId: string;
    allowedHolidays: {
      remainingDays: number;
      typeId: string;
    }[];
  }) {
    for (const element of data.allowedHolidays) {
      await this.prisma.allowedHoliday.update({
        where: {
          personnelId_typeId: {
            personnelId: data.personnelId,
            typeId: element.typeId,
          },
        },
        data: {
          remainingDays: element.remainingDays,
        },
      });
    }
    return { status: 200, message: 'succeded' };
  }
}
