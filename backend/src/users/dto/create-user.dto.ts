import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define the enum
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User username' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User password' })
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User role (optional)', enum: UserRole, required: false, example: 'ADMIN' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
