import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsMongoId } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
    example: 'Introduction to Algebra',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Level of the lesson',
    example: 1,
    required: true,
  })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({
    description: 'The ID of the subject this lesson belongs to',
    example: '6611a5f7e892be3456a6a7e2',
    required: true,
  })
  @IsMongoId()
  subjectId: string;
}
