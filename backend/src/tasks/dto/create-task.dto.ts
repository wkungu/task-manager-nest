import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'title description' })
  @IsOptional()
  @IsString()
  description?: string;
}
