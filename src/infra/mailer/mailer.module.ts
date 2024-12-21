import { Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { MailerRepository } from './mailer.repository';
import { SendGridClient } from './send-grid/send-grid.client';
import { SendGridRepository } from './send-grid/send-grid.repository';

@Module({
  imports: [EnvModule],
  providers: [
    SendGridClient,
    {
      provide: MailerRepository,
      useClass: SendGridRepository,
    },
  ],
  exports: [MailerRepository],
})
export class MailerModule {}
