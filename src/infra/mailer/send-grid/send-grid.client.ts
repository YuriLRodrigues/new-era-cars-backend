import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '@root/infra/env/env.service';
import { MailDataRequired } from '@sendgrid/mail';
import sendgrid from '@sendgrid/mail';

@Injectable()
export class SendGridClient {
  private logger: Logger;

  constructor(private readonly env: EnvService) {
    this.logger = new Logger(SendGridClient.name);
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      sendgrid.setApiKey(this.env.get('SENDGRID_API_KEY'));
      await sendgrid.send(mail);
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
    } catch (error) {
      this.logger.error('Error while sending email', error);
      throw error;
    }
  }
}
