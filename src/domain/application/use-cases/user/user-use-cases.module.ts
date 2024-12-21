import { Module } from '@nestjs/common';
import { CryptographyModule } from '@root/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@root/infra/database/database.module';
import { EnvModule } from '@root/infra/env/env.module';
import { MailerModule } from '@root/infra/mailer/mailer.module';

import { AuthorizationUserUseCase } from './authorization-user.use-case';
import { BlockSellerUseCase } from './block-seller.use-case';
import { DeleteOwnUserUseCase } from './delete-own-user.use-case';
import { DeleteUserUseCase } from './delete-user.use-case';
import { FindAllTopSellersUseCase } from './find-all-top-sellers.use-case';
import { FindAllUsersUseCase } from './find-all-users.use-case';
import { ForgotPasswordUseCase } from './forgot-password.use-case';
import { NewPasswordUseCase } from './new-password.use-case';
import { RegisterUserUseCase } from './register-user.use-case';
import { UpdateOwnUserUseCase } from './update-own-user.use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule, MailerModule],
  providers: [
    AuthorizationUserUseCase,
    BlockSellerUseCase,
    DeleteOwnUserUseCase,
    DeleteUserUseCase,
    FindAllTopSellersUseCase,
    FindAllUsersUseCase,
    ForgotPasswordUseCase,
    NewPasswordUseCase,
    RegisterUserUseCase,
    UpdateOwnUserUseCase,
  ],
  exports: [
    AuthorizationUserUseCase,
    BlockSellerUseCase,
    DeleteOwnUserUseCase,
    DeleteUserUseCase,
    FindAllTopSellersUseCase,
    FindAllUsersUseCase,
    ForgotPasswordUseCase,
    NewPasswordUseCase,
    RegisterUserUseCase,
    UpdateOwnUserUseCase,
  ],
})
export class UserUseCasesModule {}
