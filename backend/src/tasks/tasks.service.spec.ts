import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'This is a test task.',
  userId: 1,
};

describe('TasksService', () => {
  let service: TasksService;
  let prisma: {
    task: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('getTasks', () => {
    it('should return all tasks for the user', async () => {
      prisma.task.findMany.mockResolvedValue([mockTask]);
      const result = await service.getTasks(1);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      prisma.task.create.mockResolvedValue(mockTask);
      const result = await service.createTask(1, {
        title: 'Test Task',
        description: 'This is a test task.',
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.update.mockResolvedValue(mockTask);
      const result = await service.updateTask(1, 1, { title: 'Updated Task' });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      prisma.task.findUnique.mockResolvedValue(null);
      await expect(service.updateTask(999, 1, { title: 'Updated Task' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the task', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask);
      await expect(service.updateTask(1, 2, { title: 'Updated Task' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteTask', () => {
    it('should delete the task', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask);
      prisma.task.delete.mockResolvedValue(mockTask);
      const result = await service.deleteTask(1, 1);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      prisma.task.findUnique.mockResolvedValue(null);
      await expect(service.deleteTask(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the task', async () => {
      prisma.task.findUnique.mockResolvedValue(mockTask);
      await expect(service.deleteTask(1, 2)).rejects.toThrow(ForbiddenException);
    });
  });
});
