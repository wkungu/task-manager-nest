import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('TasksController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, PrismaService],
    }).compile();

    app = module.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task for a user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'taskuser@example.com',
          username: 'taskuser',
          password: 'password123',
        },
      });

      const taskData = {
        title: 'New Task',
        description: 'Task description',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${user.access_token}`) // Assuming token is passed for auth
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
    });
  });

  describe('GET /tasks', () => {
    it('should retrieve tasks for a user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'taskuser@example.com',
          username: 'taskuser',
          password: 'password123',
        },
      });

      const taskData = {
        title: 'Task for User',
        description: 'User task description',
        userId: user.id,
      };

      await prisma.task.create({ data: taskData });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${user.access_token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].title).toBe(taskData.title);
    });
  });
});
