import { IsString } from 'class-validator';

export class GetUserStarsDto {
  @IsString()
  userId: string;

  @IsString()
  subject: string;
}