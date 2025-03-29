import { IsString, IsInt, Min, IsMongoId, IsOptional } from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;

  @IsOptional()
  @IsMongoId()
  subjectId?: string; // Can update subject if needed
}
