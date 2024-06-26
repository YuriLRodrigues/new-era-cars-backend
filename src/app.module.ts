import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envSchema } from './infra/env/env';
import { EnvModule } from './infra/env/env.module';
import { AuthModule } from './infra/http/auth/auth.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    EnvModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
