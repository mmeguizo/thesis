import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { Question, Prisma } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const data: Prisma.QuestionCreateInput = createQuestionDto;
    return this.prisma.question.create({
      data,
    });
  }

  async findAll(getQuestionsDto: GetQuestionsDto) {
    const page = getQuestionsDto.page || 1;
    const limit = getQuestionsDto.limit || 10;
    const skip = (page - 1) * limit;
    
    const [total, questions] = await Promise.all([
      this.prisma.question.count(),
      this.prisma.question.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

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

  async findOne(id: string): Promise<Question> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: string, updateData: Partial<CreateQuestionDto>): Promise<Question> {
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
      await this.prisma.question.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }
}