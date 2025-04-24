import { Injectable, ConflictException, NotFoundException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './jwt-payload.interface';
import {UpdatePasswordDto} from './dto/update-password.dto';
import {UpdateUserProfileDto} from './dto/update-user-profile.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService, private readonly prisma: PrismaService) {}

  async register(data: { email: string; password: string; username: string }) {

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with that email or username already exists');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { email: data.email, username: data.username, password: hashed, role: 'USER', },
    });

    return this.generateToken({ sub: user.id, email: user.email });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken({ sub: user.id, email: user.email });
  }

  private generateToken(payload: JwtPayload) {
    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async updateUserProfile(userId: number, data: UpdateUserProfileDto, currentUser) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) throw new NotFoundException('User not found');
    if (userId !== currentUser.id) throw new ForbiddenException('Not authorized');
  
    const emailConflict = await this.prisma.user.findFirst({
      where: { email: data.email, NOT: { id: userId } },
    });
    if (emailConflict) throw new BadRequestException('Email already in use');
  
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { email: data.email, username: data.username },
    });
  
    return updated;
  }
  
  async updateUserPassword(userId: number, data: UpdatePasswordDto, currentUser) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) throw new NotFoundException('User not found');
    if (userId !== currentUser.id) throw new ForbiddenException('Not authorized');
  
    const passwordMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!passwordMatch) throw new BadRequestException('Current password is incorrect');
  
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  
    return { message: 'Password updated successfully' };
  }
  
}
