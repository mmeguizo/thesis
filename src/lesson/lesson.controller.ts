import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@ApiTags('lessons')
@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard) // Requires authentication for all endpoints
@ApiBearerAuth()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER) // Only admins & teachers can create lessons
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  async create(@Body() createLessonDto: CreateLessonDto) {
    const lesson = await this.lessonService.create(createLessonDto);
    return {
      success: true,
      message: 'Lesson created successfully',
      data: lesson,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ status: 200, description: 'Returns all lessons' })
  async findAll() {
    const lessons = await this.lessonService.findAll();
    return {
      success: true,
      message: 'Lessons retrieved successfully',
      data: lessons,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single lesson' })
  @ApiResponse({ status: 200, description: 'Returns the lesson' })
  async findOne(@Param('id') id: string) {
    const lesson = await this.lessonService.findOne(id);
    return {
      success: true,
      message: 'Lesson retrieved successfully',
      data: lesson,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  async update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonService.update(id, updateLessonDto);
    return {
      success: true,
      message: 'Lesson updated successfully',
      data: lesson,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.lessonService.remove(id);
    return {
      success: true,
      message: 'Lesson deleted successfully',
    };
  }
}
