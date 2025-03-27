import { Module } from '@nestjs/common';
import { UserQuestionService } from './user-question.service';
import { UserQuestionController } from './user-question.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserQuestionController],
  providers: [UserQuestionService, PrismaService],
  exports : [UserQuestionService]
})
export class UserQuestionModule {}
