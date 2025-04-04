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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('subjects')
@Controller('subjects')
@UseGuards(JwtAuthGuard) // Require authentication
@ApiBearerAuth()
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiResponse({ status: 201, description: 'Subject created successfully' })
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectService.create(createSubjectDto);
    return {
      success: true,
      message: 'Subject created successfully',
      data: subject,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'Returns all subjects' })
  async findAll() {
    const subjects = await this.subjectService.findAll();
    return {
      success: true,
      message: 'Subjects retrieved successfully',
      data: subjects,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single subject' })
  @ApiResponse({ status: 200, description: 'Returns the subject' })
  async findOne(@Param('id') id: string) {
    const subject = await this.subjectService.findOne(id);
    return {
      success: true,
      message: 'Subject retrieved successfully',
      data: subject,
    };
  }


  @Get('gradelevel/:gradelevel')
  @ApiOperation({ summary: 'All Subject Under a Grade Level' })
  @ApiResponse({ status: 200, description: 'All Subject Under a Grade Level' })
  async findAllSubjectUnderGradeLevel(@Param('gradelevel') gradelevel: number) {
    const level = Number(gradelevel)
    console.log(typeof level)
    const subject = await this.subjectService.findAllSubjectUnderGradeLevel(level); // You might want to use gradelevel as well
    return {
      success: true,
      message: 'All Subject retrieved successfully',
      data: subject,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subject' })
  @ApiResponse({ status: 200, description: 'Subject updated successfully' })
  async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectService.update(id, updateSubjectDto);
    return {
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subject' })
  @ApiResponse({ status: 200, description: 'Subject deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.subjectService.remove(id);
    return {
      success: true,
      message: 'Subject deleted successfully',
    };
  }
}
