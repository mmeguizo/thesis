import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetSpecificQuestionsStarsDto } from './dto/get-specific-questions-stars.dto';
@ApiTags('answers')
@Controller('answers')
@UseGuards(JwtAuthGuard) // Only logged-in users can answer questions
@ApiBearerAuth()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}
  @Post(':userId/submit')
  @ApiOperation({ summary: 'Submit an answer for a question' })
  @ApiResponse({ status: 201, description: 'Answer submitted successfully' })
  async submitAnswer(@Param('userId') userId: string, @Body() dto: SubmitAnswerDto) {
    const result = await this.answerService.submitAnswer(userId, dto);
    return {
      success: true,
      message: 'Answer submitted successfully',
      data: result,
    };
  }


  @Post('specific-questions-stars')
  @ApiOperation({ summary: 'Get total stars for specific questions' })
  @ApiResponse({ 
    status: 200, 
    description: 'Total stars retrieved successfully',
    schema: {
      example: {
        totalStars: 10, // Example response
      },
    },
  })
  async getTotalStarsForSpecificQuestions(@Body() getSpecificQuestionsStarsDto: GetSpecificQuestionsStarsDto) {
    const  {userID, subjectId} = getSpecificQuestionsStarsDto
   return await this.answerService.getTotalStarsForSpecificQuestions(userID,subjectId);
  }
  
}
