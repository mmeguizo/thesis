import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'The name of the subject',
    example: 'Mathematics',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The grade level of the lesson',
    example: 7,
    required: true,
  })
  @IsNumber() // ✅ Ensure correct casing: "IsNumber"
  gradeLevel: number;

  
}
