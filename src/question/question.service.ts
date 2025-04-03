import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UserLessonService } from '../user-lesson/user-lesson.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';


@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService ,  private userLessonService: UserLessonService,) {}

  async create(createQuestionDto: any) {
    const data = createQuestionDto;
    return this.prisma.question.create({
      data,
    });
  }

 

  async submitAnswer(userId: string, dto: SubmitAnswerDto) {
    const { questionId, subjectId, answer, timeSpent,  } = dto;

    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found.');

    const isCorrect = question.answer.toLowerCase() === answer.toLowerCase();

    let starRating = 0;
    if (isCorrect) {
      if (timeSpent <= 5) starRating = 3;
      else if (timeSpent <= 10) starRating = 2;
      else starRating = 1;
    }

    await this.prisma.userQuestion.create({
      data: { userId, questionId, subjectId, starRating, timeSpent, isCorrect },
    });

    // ✅ Update lesson stars
    if (question.lessonId) {
      await this.userLessonService.updateLessonStars(userId, question.lessonId, starRating);
    }

    return { isCorrect, starRating };
  }


  async findAll(getQuestionsDto: GetQuestionsDto) {
    const page = getQuestionsDto.page || 1;
    const limit =  Number(getQuestionsDto.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [total, questions] = await Promise.all([
      this.prisma.question.count({
        where: { isActive: true },
      }),
      this.prisma.question.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }) || [],
    ])  // Return an empty array if no data is found

    return {
      questions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id,   isActive: true  },
      select :{
        id : true,
        lesson : {
          select : {
            title : true
          }
        },
        question : true,
        tutorialLink : true,
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: string, updateData: UpdateQuestionDto) {
    try {
      return await this.prisma.question.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.question.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }
}