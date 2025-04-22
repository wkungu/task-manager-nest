import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { email: string; username: string; password: string; role?: 'USER' | 'ADMIN' }) {
    return this.prisma.user.create({ data: {
      ...data,
      role: data.role || 'USER',
    }, select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
    }, });
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({ where: { email },  select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
    }, });
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({ where: { id },   select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
    }, });
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id: number, data: { email?: string; username?: string; password?: string; role?: 'USER' | 'ADMIN' }) {

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: number) {

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
