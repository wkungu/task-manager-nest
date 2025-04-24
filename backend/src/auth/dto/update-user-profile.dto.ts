import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserProfileDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;
}