import { Controller, Post, Get, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      example: {
        message: 'User registered successfully',
        accessToken: 'jwt.token.here',
        user: {
          id: '507f1f77bcf86cd799439011',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'https://example.com/avatar.jpg'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      example: {
        accessToken: 'jwt.token.here',
        user: {
          id: '507f1f77bcf86cd799439011',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'https://example.com/avatar.jpg'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200,
    description: 'Returns the user profile',
    schema: {
      example: {
        id: '507f1f77bcf86cd799439011',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://example.com/avatar.jpg'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
