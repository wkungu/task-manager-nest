import { Body, Controller, Post, Put, ParseIntPipe, Param, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { User as CurrentUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import {UpdatePasswordDto} from './dto/update-password.dto';
import {UpdateUserProfileDto} from './dto/update-user-profile.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private auth: AuthService, private readonly usersService: UsersService,) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiConflictResponse({ description: 'User with that email or username already exists' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiCreatedResponse({
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Missing or invalid credentials' })
  @ApiConflictResponse({ description: 'User not found or password mismatch' })
  login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiOkResponse({
    description: 'Authenticated user info',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  async getMe(@CurrentUser() user): Promise<UserResponseDto> {
    return this.usersService.findById(user.id);
  }

  @Put('users/:id/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() data: UpdateUserProfileDto,
    @CurrentUser() user,
  ) {
    return this.auth.updateUserProfile(userId, data, user);
  }

  @Put('users/:id/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user password' })
  async updatePassword(
    @Param('id', ParseIntPipe) userId: number,
    @Body() data: UpdatePasswordDto,
    @CurrentUser() user,
  ) {
    return this.auth.updateUserPassword(userId, data, user);
  }

}
