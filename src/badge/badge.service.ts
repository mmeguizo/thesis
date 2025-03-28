import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BadgeService {
  constructor(private prisma: PrismaService) {}

  // Check if a user qualifies for a new badge
  async checkAndAssignBadge(userId: string) {
    const totalStars = await this.prisma.userLesson.aggregate({
      where: { userId },
      _sum: { totalStars: true },
    });

    const userTotalStars = totalStars._sum.totalStars || 0;

    // Find badges the user qualifies for
    const earnedBadges = await this.prisma.badge.findMany({
      where: { minStars: { lte: userTotalStars } },
    });

    for (const badge of earnedBadges) {
      const alreadyHasBadge = await this.prisma.userBadge.findFirst({
        where: { userId, badgeId: badge.id },
      });

      if (!alreadyHasBadge) {
        await this.prisma.userBadge.create({
          data: { userId, badgeId: badge.id },
        });
      }
    }
  }

  // Get all badges a user has earned
  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });
  }
}
