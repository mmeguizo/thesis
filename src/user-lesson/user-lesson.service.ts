import { CreateUserLessonDto } from "./dto/create-user-lesson.dto";
import { UpdateUserLessonDto } from "./dto/update-user-lesson.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BadgeService } from "../badge/badge.service";

@Injectable()
export class UserLessonService {
  constructor(
    private prisma: PrismaService,
    private badgeService: BadgeService
  ) {}

 

  // Fetch lesson progress for a user
  async getUserLessonProgress(userId: string) {
    return this.prisma.userLesson.findMany({
      where: { userId },
      include: { lesson: true },
    });
  }

  // Update lesson stars when user answers a question
  // async updateLessonStars(
  //   userId: string,
  //   lessonId: string,
  //   starsEarned: number
  // ) {
  //   let userLesson = await this.prisma.userLesson.findFirst({
  //     where: { userId, lessonId },
  //   });

  //   if (userLesson) {
  //     return this.prisma.userLesson.update({
  //       where: { id: userLesson.id },
  //       data: { totalStars: userLesson.totalStars + starsEarned },
  //     });
  //   } else {
  //     return this.prisma.userLesson.create({
  //       data: { userId, lessonId, totalStars: starsEarned },
  //     });
  //   }
  // }

  async updateLessonStars(userId: string, lessonId: string, starsEarned: number) {
    let userLesson = await this.prisma.userLesson.findFirst({
      where: { userId, lessonId },
    });

    if (userLesson) {
      await this.prisma.userLesson.update({
        where: { id: userLesson.id },
        data: { totalStars: userLesson.totalStars + starsEarned },
      });
    } else {
      await this.prisma.userLesson.create({
        data: { userId, lessonId, totalStars: starsEarned },
      });
    }

    // ✅ Check and assign new badges
    await this.badgeService.checkAndAssignBadge(userId);
  }

}
