import { IsString, IsInt, Min } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  answer: string;

  @IsInt()
  @Min(0)
  timeSpent: number;
}
