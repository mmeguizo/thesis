import { Module } from '@nestjs/common';
import { UserLessonService } from './user-lesson.service';
import { UserLessonController } from './user-lesson.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeModule } from 'src/badge/badge.module';

@Module({
  controllers: [UserLessonController],
  providers: [UserLessonService, PrismaService],
  exports :[UserLessonService],
  imports : [BadgeModule]
})
export class UserLessonModule {}
