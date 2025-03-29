import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'The name of the subject',
    example: 'Mathematics',
    required: true,
  })
  @IsString()
  name: string;
}
