import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsInt, Min } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question text',
    example: 'What is 2 + 2?',
    required: true,
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Correct answer',
    example: '4',
    required: true,
  })
  @IsString()
  answer: string;
  
  @ApiProperty({
    description: 'Time limit to answer in seconds',
    example: 180, // 3 minutes
    required: true,
  })
  @IsInt()
  @Min(10) // Minimum 10 seconds to prevent too-short time
  timeLimit: number;
  
  @ApiProperty({
    description: 'Grade level of the question',
    example: 7, // 3 minutes
    required: true,
  })
  @IsInt()
  @Min(7) // Minimum 10 seconds to prevent too-short time
  gradeLevel: number;

  @ApiProperty({
    description: 'Lesson ID of the question',
    example: '6611a5f7e892be3456a6a7e2',
    required: true,
  })
  @IsMongoId()
  lessonId: string;


}
