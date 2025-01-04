import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', minLength: 4, maxLength: 20 })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

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

  @ApiPropertyOptional({ 
    enum: UserRole, 
    default: UserRole.STUDENT,
    description: 'User role (ADMIN/TEACHER/STUDENT). Only admins can set this.'
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatar?: string;
} 