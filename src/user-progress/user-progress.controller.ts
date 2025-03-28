import { Controller, Get, Param } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';

@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get(':userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.userProgressService.getUserProgress(userId);
  }
}
