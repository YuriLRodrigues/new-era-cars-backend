import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { envSchema } from '@root/infra/env/env';
import { verify } from 'jsonwebtoken';

import { UserPayload } from './auth-user';

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): UserPayload => {
  let token = '';

  token = context.switchToHttp().getRequest().headers['authorization'].replace('Bearer ', '');

  const publicKey = Buffer.from(envSchema.parse(process.env).JWT_PUBLIC_KEY, 'base64');

  const decoded = verify(token, publicKey, {
    algorithms: ['RS256'],
  }) as UserPayload;

  return {
    sub: decoded.sub,
    roles: decoded.roles,
  };
});
