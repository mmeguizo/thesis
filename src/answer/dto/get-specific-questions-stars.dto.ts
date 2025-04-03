import { IsString, IsMongoId, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSpecificQuestionsStarsDto {

    @ApiProperty({
        description: 'ID of the user',
        example: '67cc60c53626ea9a0245a514',
        required: true,
      })
      @IsMongoId()
      userID: string;

      @ApiProperty({
        description: 'ID of the subject this question belongs to',
        example: '67e7d67c188122c58866a207',
        required: true,
      })
      @IsMongoId()
      subjectId: string;



}