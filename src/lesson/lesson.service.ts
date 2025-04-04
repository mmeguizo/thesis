import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    // Ensure subject exists before creating a lesson
    const subject = await this.prisma.subject.findUnique({
      where: { id: createLessonDto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        // level: createLessonDto.level,
        subjectId: createLessonDto.subjectId,
      },
      include: { subject: true }, // Include subject data in the response
    });
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: { subject: true }, // Include subject details
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { subject: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    // Check if lesson exists
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // If subject is being updated, ensure it exists
    if (updateLessonDto.subjectId) {
      const subject = await this.prisma.subject.findUnique({
        where: { id: updateLessonDto.subjectId },
      });

      if (!subject) {
        throw new NotFoundException('New subject not found');
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: { subject: true },
    });
  }

  async remove(id: string) {
    // Check if lesson exists
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.delete({ where: { id } });
  }
}
