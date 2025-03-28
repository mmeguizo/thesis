import { Module } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { UserProgressController } from './user-progress.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserProgressController],
  providers: [UserProgressService, PrismaService],
})
export class UserProgressModule {}
