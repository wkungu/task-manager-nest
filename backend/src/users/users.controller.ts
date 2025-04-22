import { Controller, Get, Post, Put, Body, Delete, UseGuards, Param, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiBody, ApiTags, ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@ApiBearerAuth('access-token')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserResponseDto] })
  async getAllUsers(): Promise<UserResponseDto[]>  {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserById(@Param('id') id: number) : Promise<UserResponseDto | null> {
    return this.usersService.findById(+id);
  }

  @Post()
  @Roles('ADMIN') // Only admins can create other admin users
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'Creates a new user (ADMIN-only)',
  })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser({ ...data, role: data.role || 'ADMIN' });
  }

  @Put(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id') id: number,
    @Body() data: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(+id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ schema: { example: { message: 'User deleted successfully' } } })
  @ApiNotFoundResponse({ description: 'User not found' })
  async deleteUser(@Param('id') id: number) {
    await this.usersService.deleteUser(+id);
    return { message: `User with ID ${id} deleted successfully.` };
  }
}
