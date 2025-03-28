import { Injectable, ConflictException , BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(getUsersDto: GetUsersDto) {
    const page = getUsersDto.page ? Number(getUsersDto.page) : 1;
    const limit = getUsersDto.limit ? Number(getUsersDto.limit) : 10;
    const { search } = getUsersDto;

    // If page is -1, return all users
    if (page === -1) {
      const users = await this.prisma.user.findMany({
        where: search ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        data: users,
        total: users.length,
        page: -1,
        limit: users.length,
      };
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get users with pagination
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: search ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: search ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
      }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password, firstName, lastName, avatar, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        avatar,
        role: role || 'STUDENT', // Default to STUDENT if not specified
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'User created successfully',
      user,
    };
  }

  // ✅ New Method: Update Password
  async updatePassword(userId: string, body: UpdateUserDto) {

    const { password } = body;

    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
} 