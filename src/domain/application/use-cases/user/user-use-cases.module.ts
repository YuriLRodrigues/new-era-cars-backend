import { Module } from '@nestjs/common';
import { CryptographyModule } from '@root/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@root/infra/database/database.module';

import { AuthorizationUserUseCase } from './authorization-user.use-case';
import { BlockSellerUseCase } from './block-seller.use-case';
import { DeleteOwnUserUseCase } from './delete-own-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { FindAllUsersUseCase } from './find-all-users.use-case';
import { RegisterUserUseCase } from './register-user.use-case';
import { UpdateUserInfoUseCase } from './update-user-info.use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    DeleteOwnUserUseCase,
    RegisterUserUseCase,
    AuthorizationUserUseCase,
    FindAllUsersUseCase,
    UpdateUserInfoUseCase,
    BlockSellerUseCase,
    DeleteUserUseCase,
  ],
  exports: [
    DeleteOwnUserUseCase,
    RegisterUserUseCase,
    AuthorizationUserUseCase,
    FindAllUsersUseCase,
    UpdateUserInfoUseCase,
    BlockSellerUseCase,
    DeleteUserUseCase,
  ],
})
export class UserUseCasesModule {}
