import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiResponseDto, PaginatedResponseDto } from '../common/dto/api-response.dto';

@ApiTags('questions')
@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new question (Admin and Teacher only)' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  async create(@Body() createQuestionDto: CreateQuestionDto): Promise<ApiResponseDto<any>> {
    const question = await this.questionService.create(createQuestionDto);
    return {
      success: true,
      message: 'Question created successfully',
      data: question,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns all questions' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedResponseDto<any>> {
    const { questions, meta } = await this.questionService.findAll(+page, +limit);
    return {
      success: true,
      message: 'Questions retrieved successfully',
      data: questions,
      meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a question by id' })
  @ApiResponse({ status: 200, description: 'Returns a single question' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const question = await this.questionService.findOne(id);
    return {
      success: true,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update a question (Admin and Teacher only)' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: CreateQuestionDto,
  ): Promise<ApiResponseDto<any>> {
    const question = await this.questionService.update(id, updateQuestionDto);
    return {
      success: true,
      message: 'Question updated successfully',
      data: question,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a question (Admin only)' })
  @ApiResponse({ status: 200, description: 'Question deleted successfully' })
  async remove(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.questionService.remove(id);
    return {
      success: true,
      message: 'Question deleted successfully',
      data: null,
    };
  }
}