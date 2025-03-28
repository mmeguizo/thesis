import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserLessonModule } from 'src/user-lesson/user-lesson.module';

@Module({
  imports: [UserLessonModule],
  controllers: [QuestionController],
  providers: [QuestionService, PrismaService],
  exports : [QuestionService]
})
export class QuestionModule {}
