import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsISO8601 } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'ID of the question being answered',
    example: '6611a5f7e892be3456a6a7e2',
    required: true,
  })
  @IsMongoId()
  questionId: string;

  @ApiProperty({
    description: 'ID of the subject this question belongs to',
    example: '6611a5f7e892be3456a6a7e2',
    required: true,
  })
  @IsMongoId()
  subjectId: string;

  @ApiProperty({
    description: 'The user’s submitted answer',
    example: '4',
    required: true,
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'The time when the user started answering (ISO8601 format)',
    example: '2025-03-29T10:00:00Z',
    required: true,
  })
  @IsISO8601()
  startTime: string;
}
