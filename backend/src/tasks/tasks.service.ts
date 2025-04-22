import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasks(userId: number) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async createTask(userId: number, data: { title: string; description?: string }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
    });
  }

  async updateTask(taskId: number, userId: number, data: { title?: string; description?: string; completed?: boolean }) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async deleteTask(taskId: number, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.task.delete({ where: { id: taskId } });
  }
}
