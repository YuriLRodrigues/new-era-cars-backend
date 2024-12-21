import { BadRequestException, Body, ConflictException, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { RegisterUserUseCase } from '@root/domain/application/use-cases/user/register-user.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Public } from '@root/infra/auth/public';

import { SignUpBodyDto, SwaggerSignUpDto } from '../../dto/user/sign-up.dto';

@ApiTags('User - Controller')
@Controller('user')
export class SignUpController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Public()
  @SwaggerSignUpDto()
  @Post('/sign-up')
  async handle(@Body() { avatar, email, name, password, role, username }: SignUpBodyDto) {
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

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
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
      message: 'User created successfully',
    };
  }
}
