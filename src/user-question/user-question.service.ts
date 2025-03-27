import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserQuestionService {
  constructor(private prisma: PrismaService) {}

  async getTotalStarsForSubject(userId: string, subject: string): Promise<number> {
    const userQuestions = await this.prisma.userQuestion.findMany({
      where: {
        userId,
        question: {
          subject,
        },
      },
      select: {
        starRating: true,
      },
    });

    const totalStars = userQuestions.reduce((sum, userQuestion) => {
      return sum + (userQuestion.starRating || 0);
    }, 0);

    return totalStars;
  }
}
