import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Test123!',
    description: 'Password must contain at least 1 uppercase, 1 lowercase, and 1 number or special character'
  })
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak, must contain at least 1 uppercase, 1 lowercase, and 1 number or special character',
  })
  password: string;
}
