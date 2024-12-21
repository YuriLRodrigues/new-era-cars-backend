import { Injectable } from '@nestjs/common';
import { Mail } from '@root/domain/enterprise/entities/mail';

import { MailerRepository } from '../mailer.repository';
import { SendGridClient } from './send-grid.client';

@Injectable()
export class SendGridRepository implements MailerRepository {
  constructor(private readonly sendGridClient: SendGridClient) {}

  async sendMail(mailer: Mail): Promise<void> {
    await this.sendGridClient.send({
      from: 'rodriguesyuri769@gmail.com',
      to: mailer.email,
      subject: mailer.subject,
      html: mailer.body,
    });
  }

  async sendManyMail(mailer: Mail[]): Promise<void> {
    await this.sendGridClient.send({
      from: 'rodriguesyuri769@gmail.com',
      to: mailer.map((mail) => mail.email),
      subject: mailer[0].subject,
      html: mailer[0].body,
    });
  }
}
