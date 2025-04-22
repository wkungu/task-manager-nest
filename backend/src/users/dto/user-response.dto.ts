
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'], example: 'USER' })
  role: 'USER' | 'ADMIN';

  @ApiProperty()
  createdAt: Date;
}
