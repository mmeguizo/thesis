import { Controller, Get, Post, Body, Query, UseGuards, UseInterceptors, UploadedFile, MaxFileSizeValidator, ParseFilePipe, Delete, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users with pagination (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated users list',
    schema: {
      example: {
        data: [
          {
            id: '507f1f77bcf86cd799439011',
            username: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://example.com/avatar.jpg',
            role: 'STUDENT',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Only ADMIN can access this resource' })
  findAll(@Query() getUsersDto: GetUsersDto) {
    return this.userService.findAll(getUsersDto);
  }

  @Post('add-user')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      example: {
        message: 'User created successfully',
        user: {
          id: '507f1f77bcf86cd799439011',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'https://example.com/avatar.jpg',
          role: 'TEACHER',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Only ADMIN can access this resource' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    const fileUrl = `${process.env.APP_URL}/uploads/${file.filename}`;
    return {
      message: 'File uploaded successfully',
      fileUrl,
    };
  }

  @Delete('upload/:filename')
  async deleteFile(@Param('filename') filename: string) {
    const filepath = `./uploads/${filename}`;
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return { message: 'File deleted successfully' };
    }
    
    throw new NotFoundException('File not found');
  }
} 