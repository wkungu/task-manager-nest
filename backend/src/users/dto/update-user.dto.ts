import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User email (optional)', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'User username (optional)', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'User password (optional)', required: false })
  @IsString()
  @IsOptional()
  password?: string;
}
