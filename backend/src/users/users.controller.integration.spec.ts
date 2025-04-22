import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest'; // For HTTP requests in integration tests

describe('UsersController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    app = module.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    usersService = app.get<UsersService>(UsersService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users/register', () => {
    it('should register a new user and return a token', async () => {
      const userData = {
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.access_token).toBeDefined();
    });

    it('should throw an error if email or username is already taken', async () => {
      const existingUser = await prisma.user.create({
        data: {
          email: 'existing@example.com',
          username: 'existinguser',
          password: 'password123',
        },
      });

      const userData = {
        email: existingUser.email,
        username: existingUser.username,
        password: 'newpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe('User with that email or username already exists');
    });
  });

  describe('POST /users/login', () => {
    it('should log in a user and return a token', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'loginuser@example.com',
          username: 'loginuser',
          password: 'password123',
        },
      });

      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.email,
          password: 'password123',
        })
        .expect(200);

      expect(response.body.access_token).toBeDefined();
    });

    it('should throw an error if credentials are invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
