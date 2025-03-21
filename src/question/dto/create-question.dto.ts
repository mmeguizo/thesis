import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionDto  {
  @ApiProperty({ example: 'What is 2+2?' })
  @IsString()
  question: string;

  @ApiProperty({ example: '4' })
  @IsString()
  answer: string;

  @ApiPropertyOptional({ example: 'Think about basic addition' })
  @IsString()
  @IsOptional()
  hint?: string;

  @ApiPropertyOptional({ example: 'https://example.com/math-tutorial' })
  @IsString()
  @IsOptional()
  tutorialLink?: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(12)
  gradeLevel: number;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  subject: string;
}