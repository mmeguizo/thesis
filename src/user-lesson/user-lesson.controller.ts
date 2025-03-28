import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserLessonService } from './user-lesson.service';
import { CreateUserLessonDto } from './dto/create-user-lesson.dto';
import { UpdateUserLessonDto } from './dto/update-user-lesson.dto';

@Controller('user-lessons')
export class UserLessonController {
  constructor(private readonly userLessonService: UserLessonService) {}

  @Get(':userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.userLessonService.getUserLessonProgress(userId);
  }
}

