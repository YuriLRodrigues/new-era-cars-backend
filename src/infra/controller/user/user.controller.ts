import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AuthorizationUserUseCase } from '@root/domain/application/use-cases/user/authorization-user.use-case';
import { BlockSellerUseCase } from '@root/domain/application/use-cases/user/block-seller.use-case';
import { DeleteOwnUserUseCase } from '@root/domain/application/use-cases/user/delete-own-user.use-case';
import { DeleteUserUseCase } from '@root/domain/application/use-cases/user/delete-user.use-case';
import { FindAllUsersUseCase } from '@root/domain/application/use-cases/user/find-all-users.use-case';
import { RegisterUserUseCase } from '@root/domain/application/use-cases/user/register-user.use-case';
import { UpdateUserInfoUseCase } from '@root/domain/application/use-cases/user/update-user-info.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/http/auth/auth-user';
import { CurrentUser } from '@root/infra/http/auth/current-user';
import { Public } from '@root/infra/http/auth/public';
import { Roles } from '@root/infra/http/auth/roles';

import { AuthorizationUserDTO } from './dto/authorization-user.dto';
import { UserViewModel, UserViewModelProps } from './dto/find-all.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BlockSellerResponseSwagger } from './swagger-responses-dtos/block-seller';
import { DeleteUserResponseSwagger } from './swagger-responses-dtos/delete';
import { FindAllResponsesSwagger } from './swagger-responses-dtos/find-all';
import { SigninResponsesSwagger } from './swagger-responses-dtos/signin';
import { SignupResponsesSwagger } from './swagger-responses-dtos/signup';
import { UpdateUserResponseSwagger } from './swagger-responses-dtos/update';

@ApiTags('User - Controller')
@Controller('user')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authorizationUserUseCase: AuthorizationUserUseCase,
    private readonly updateUserInfoUseCase: UpdateUserInfoUseCase,
    private readonly deleteOwnUserUseCase: DeleteOwnUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly blockSellerUseCase: BlockSellerUseCase,
  ) {}

  @ApiCreatedResponse({
    status: 201,
    description: 'User created successfully',
    type: SignupResponsesSwagger[201],
  })
  @ApiConflictResponse({
    status: 409,
    description: 'User already exists',
    type: SignupResponsesSwagger[409],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal API Error',
    type: SignupResponsesSwagger[400],
  })
  @ApiBody({ description: 'Body a ser passado para a requisição', type: RegisterUserDTO })
  @Public()
  @Post('/signup')
  async register(@Body() { avatar, email, name, password, role, username }: RegisterUserDTO) {
    const user = await this.registerUserUseCase.execute({
      avatar,
      email,
      name,
      password,
      username,
      role: UserRoles[role],
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.message) {
        case 'User already exists':
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 201,
      message: 'User created successfully',
    };
  }

  @ApiOkResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: SigninResponsesSwagger[200],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal API Error',
    type: SigninResponsesSwagger[400],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Invalid Wrong Credencials',
    type: SigninResponsesSwagger[404],
  })
  @ApiBody({ description: 'Body a ser passado para a requisição', type: AuthorizationUserDTO })
  @Public()
  @Post('/signin')
  async authorization(@Body() { email, password }: AuthorizationUserDTO) {
    const user = await this.authorizationUserUseCase.execute({
      email,
      password,
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.message) {
        case 'Invalid Wrong Credencials':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      message: 'User successfully authenticated',
      token: user.value,
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'User successfully updated',
    type: UpdateUserResponseSwagger[200],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal API Error',
    type: UpdateUserResponseSwagger[400],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: UpdateUserResponseSwagger[404],
  })
  @ApiBody({ description: 'Body a ser passado para a requisição', type: UpdateUserDto })
  @Patch()
  async update(@Body() { avatar, name, role, username }: UpdateUserDto, @CurrentUser() { sub }: UserPayload) {
    const user = await this.updateUserInfoUseCase.execute({
      id: new UniqueEntityId(sub),
      avatar,
      name,
      username,
      role: UserRoles[role],
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.message) {
        case 'User not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      message: 'User successfully updated',
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Users found',
    type: UpdateUserResponseSwagger[200],
    isArray: true,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal API Error',
    type: FindAllResponsesSwagger[400],
  })
  @Roles({ roles: [UserRoles.Manager] })
  @Get('/findAll')
  async findAll(@Query('page') page: string): Promise<UserViewModelProps[]> {
    const users = await this.findAllUsersUseCase.execute({ limit: 30, page: Number(page) - 1 });

    if (users.isLeft()) {
      const error = users.value;

      switch (error.message) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return users.value.map(UserViewModel.toHttp);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'User deleted successfully',
    type: DeleteUserResponseSwagger[200],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal API Error',
    type: DeleteUserResponseSwagger[400],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: DeleteUserResponseSwagger[404],
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid permission to delete an user',
    type: DeleteUserResponseSwagger[401],
  })
  @ApiParam({
    name: 'User to delete - Admin permission',
    example: '/60360fc7-381e-44c9-b430-88f7ba344fc4',
  })
  @Delete(':id')
  async delete(@CurrentUser() { sub }: UserPayload, @Param('id') id: string) {
    const user = await this.deleteUserUseCase.execute({
      currentUserId: new UniqueEntityId(sub),
      userId: new UniqueEntityId(id),
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.message) {
        case 'User not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case 'Invalid permission to delete an user':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 200,
      message: 'User deleted successfully',
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Your user has been successfully deleted',
    type: DeleteUserResponseSwagger[200],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal API Error',
    type: DeleteUserResponseSwagger[400],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: DeleteUserResponseSwagger[404],
  })
  @Delete('/own')
  async deleteOwn(@CurrentUser() { sub }: UserPayload) {
    const user = await this.deleteOwnUserUseCase.execute({
      id: new UniqueEntityId(sub),
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.message) {
        case 'User not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 200,
      message: 'Your user has been successfully deleted',
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Seller successfully blocked',
    type: BlockSellerResponseSwagger[200],
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Internal API Error',
    type: BlockSellerResponseSwagger[400],
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid permission block an seller',
    type: BlockSellerResponseSwagger[401],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: BlockSellerResponseSwagger[404],
  })
  @ApiParam({
    name: 'Seller to block - Admin Permission',
    example: '/block/60360fc7-381e-44c9-b430-88f7ba344fc4',
  })
  @Roles({ roles: [UserRoles.Manager] })
  @Patch('/block/:id')
  async blockSeller(@CurrentUser() { sub }: UserPayload, @Param('id') id: string) {
    const user = await this.blockSellerUseCase.execute({
      currentUserId: new UniqueEntityId(sub),
      sellerId: new UniqueEntityId(id),
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.message) {
        case 'User not found':
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case 'Invalid permission to block an seller':
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      statusCode: 200,
      message: 'Seller successfully blocked',
    };
  }
}
