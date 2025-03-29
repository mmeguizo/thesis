import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import * as moment from 'moment';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async submitAnswer(userId: string, dto: SubmitAnswerDto) {
    const { questionId, subjectId, answer, startTime } = dto;
  
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found.');
  
    const isCorrect = question.answer.toLowerCase() === answer.toLowerCase();
  
    // ✅ Calculate time spent in minutes
    const timeSpent = Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 1000 / 60);
  
    let starRating = 0;
    if (isCorrect) {
      if (timeSpent <= 3) starRating = 3;
      else if (timeSpent <= 5) starRating = 2;
      else starRating = 1;
    }
  
    await this.prisma.userQuestion.create({
      data: { userId, questionId, subjectId, starRating, timeSpent, isCorrect },
    });
  
    if (question.lessonId) {
      // ✅ Check if UserLesson exists
      const userLesson = await this.prisma.userLesson.findFirst({
        where: { userId, lessonId: question.lessonId },
      });
  
      if (userLesson) {
        // ✅ If it exists, update the total stars
        await this.prisma.userLesson.update({
          where: { id: userLesson.id },
          data: { totalStars: { increment: starRating } },
        });
      } else {
        // ✅ If it doesn't exist, create a new UserLesson record
        await this.prisma.userLesson.create({
          data: {
            userId,
            lessonId: question.lessonId,
            totalStars: starRating,
          },
        });
      }
    }
  
    return { isCorrect, starRating };
  }
  

}
