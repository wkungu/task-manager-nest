import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';

@Controller('tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current authenticated user' })
  @ApiOkResponse({
    description: 'Successfully retrieved tasks for the user',
    type: [TaskResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getTasks(@Request() req) {
    return this.tasksService.getTasks(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task for the authenticated user' })
  @ApiCreatedResponse({
      type: TaskResponseDto,
      description: 'Successfully created a new task',
    })
  @ApiBody({ type: CreateTaskDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Access denied for the user' })
  async createTask(@Request() req, @Body() body: CreateTaskDto) {
    return this.tasksService.createTask(req.user.userId, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiOkResponse({
    description: 'Successfully updated the task',
    type: TaskResponseDto,
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateTask(
    @Request() req,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(+id, req.user.userId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing task' })
  @ApiOkResponse({
    description: 'Successfully deleted the task',
    schema: { example: { message: 'Task deleted successfully' } },
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteTask(@Request() req, @Param('id') id: string) {
    return this.tasksService.deleteTask(+id, req.user.userId);
  }
}
