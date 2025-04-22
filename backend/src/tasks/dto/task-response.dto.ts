import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Complete NestJS documentation' })
  title: string;

  @ApiProperty({ example: 'Write detailed documentation for the project' })
  description: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '2025-04-21T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-04-22T12:00:00.000Z' })
  updatedAt: string;
}
