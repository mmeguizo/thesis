import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    // Fetch total stars earned by the user
    const totalStarsResult = await this.prisma.userLesson.aggregate({
      where: { userId },
      _sum: { totalStars: true },
    });

    const userTotalStars = totalStarsResult._sum.totalStars || 0;

    // Fetch all badges sorted by required stars
    const allBadges = await this.prisma.badge.findMany({
      orderBy: { minStars: 'asc' },
    });

    // Fetch earned badges
    const earnedBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });

    // Determine the next badge
    const nextBadge = allBadges.find((badge) => badge.minStars > userTotalStars);

    // Calculate stars needed for the next badge
    const starsNeeded = nextBadge ? nextBadge.minStars - userTotalStars : 0;

    return {
      totalStars: userTotalStars,
      badges: earnedBadges.map((ub) => ({
        badgeId: ub.badgeId,
        name: ub.badge.name,
        description: ub.badge.description,
      })),
      nextBadge: nextBadge
        ? {
            name: nextBadge.name,
            starsNeeded: starsNeeded,
          }
        : null,
    };
  }
}
