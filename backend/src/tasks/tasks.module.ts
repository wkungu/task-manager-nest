import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import the PrismaModule

@Module({
  imports: [PrismaModule], // Import PrismaModule here
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
