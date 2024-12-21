import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { NewPasswordUseCase } from '@root/domain/application/use-cases/user/new-password.use-case';
import { Public } from '@root/infra/auth/public';

import { NewPasswordBodyDto, NewPasswordQueryDto, SwaggerNewPasswordDto } from '../../dto/user/new-password.dto';

@ApiTags('User - Controller')
@Controller('user')
export class NewPasswordController {
  constructor(private readonly newPasswordUseCase: NewPasswordUseCase) {}

  @Public()
  @SwaggerNewPasswordDto()
  @Patch('/new-password')
  async handle(@Body() { newPassword }: NewPasswordBodyDto, @Query() { token }: NewPasswordQueryDto) {
    const user = await this.newPasswordUseCase.execute({
      newPassword,
      token: new UniqueEntityId(token),
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
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
      message: 'Password changed successfully',
    };
  }
}
