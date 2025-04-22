import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // Import bcrypt

const mockUser = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashedpassword',
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwtService = { sign: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      prisma.user.findFirst.mockResolvedValue(null); // No existing user
      prisma.user.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('fakeToken');

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });

      expect(result).toEqual({ access_token: 'fakeToken' });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          username: 'testuser',
          password: expect.any(String), // Hashed password
          role: 'USER',
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
    });

    it('should throw ConflictException if user exists with the same email or username', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser); // Existing user

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
    //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as boolean); // Mock bcrypt.compare to always return true for the correct password
    jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain, hashed) => {
        // Example: check if the passwords match
        if (plain === 'password123' && hashed === mockUser.password) {
        return true;
        }
        return false;
    });
      jwtService.sign.mockReturnValue('fakeToken');

      const result = await service.login('test@example.com', 'password123');

      expect(result).toEqual({ access_token: 'fakeToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null); // No user found

      await expect(service.login('test@example.com', 'password123')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
    //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as boolean); // Mock bcrypt.compare to return false for incorrect password
    // Correct way to mock bcrypt.compare
    jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain, hashed) => {
        // Example: check if the passwords match
        if (plain === 'password123' && hashed === mockUser.password) {
        return true;
        }
        return false;
    });

      await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });
  });
});
