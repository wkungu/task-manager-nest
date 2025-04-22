import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Task title (optional)', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Task description (optional)', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Task completed (optional)', required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
