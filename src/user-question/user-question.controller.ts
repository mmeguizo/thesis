import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserQuestionService } from './user-question.service';
import { GetUserStarsDto } from './dto/get-user-stars.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
@Controller('user-question')
export class UserQuestionController {
  constructor(private readonly userQuestionService: UserQuestionService) {}


  @Get('total-stars')
  @ApiOperation({ summary: 'Get total stars earned by a user in a specific subject' })
  @ApiResponse({ 
    status: 200, 
    description: 'Total stars retrieved successfully',
    schema: {
      example: {
        totalStars: 5, // Example response
      },
    },
  })
  @ApiQuery({ 
    name: 'userId', 
    required: true, 
    type: String, 
    description: 'ID of the user', 
    example: '507f1f77bcf86cd799439011' // Example user ID
  })
  @ApiQuery({ 
    name: 'subject', 
    required: true, 
    type: String, 
    description: 'Subject to query stars for', 
    example: 'Math' // Example subject
  })
  async getTotalStars(@Query() getUserStarsDto: GetUserStarsDto) {
    const { userId, subject } = getUserStarsDto;
    const totalStars = await this.userQuestionService.getTotalStarsForSubject(userId, subject);
    return { totalStars };
  }
  }

