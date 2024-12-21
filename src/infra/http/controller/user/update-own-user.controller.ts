import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UpdateOwnUserUseCase } from '@root/domain/application/use-cases/user/update-own-user.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';

import { SwaggerUpdateOwnUserDto, UpdateOwnUserBodyDto } from '../../dto/user/update-own-user.dto';

@ApiTags('User - Controller')
@Controller('user')
export class UpdateOwnUserController {
  constructor(private readonly updateOwnUserUseCase: UpdateOwnUserUseCase) {}

  @SwaggerUpdateOwnUserDto()
  @Patch('/update-own')
  async handle(@Body() { avatar, name, role, username }: UpdateOwnUserBodyDto, @CurrentUser() { sub }: UserPayload) {
    const user = await this.updateOwnUserUseCase.execute({
      id: new UniqueEntityId(sub),
      avatar,
      name,
      username,
      role: UserRoles[role],
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
      message: 'User successfully updated',
    };
  }
}
