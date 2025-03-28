import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuestionModule } from './question/question.module';
import { UserQuestionModule } from './user-question/user-question.module';
import { UserLessonModule } from './user-lesson/user-lesson.module';
import { BadgeModule } from './badge/badge.module';
import { UserProgressModule } from './user-progress/user-progress.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    QuestionModule,
    UserQuestionModule,
    UserLessonModule,
    BadgeModule,
    UserProgressModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {} 