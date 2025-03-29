import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSubjectDto {
  @ApiProperty({
    description: 'The new name of the subject',
    example: 'Advanced Mathematics',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
