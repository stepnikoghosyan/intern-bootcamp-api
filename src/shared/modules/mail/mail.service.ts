import { Injectable } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { join } from 'path';
import { renderFile } from 'ejs';
import { ConfigService } from '@nestjs/config';

// models
import { IMailDataBase } from './models/mail-data-base.model';
import {
  IMailActions,
  MailActions,
  MailTemplateData,
} from './models/mail-actions.model';
import { ConfigEnum } from '../../interfaces/config-enum.enum';

// helpers
import { validateEmailTemplateData } from './helpers/validate-email-template-data.helper';
import { getMailConfig } from './helpers/mail-config-factory.helper';

@Injectable()
export class MailService {
  constructor(
    private readonly sendGrid: SendGridService,
    private readonly configService: ConfigService,
  ) {}

  public async sendMail<K extends keyof IMailActions>(
    action: MailActions,
    data: MailTemplateData<K>,
  ): Promise<boolean> {
    try {
      await validateEmailTemplateData(data, MailTemplateData);
    } catch (errors) {
      console.log('error1:', errors);
      return false;
    }

    let html: string;
    let mailConfig: IMailDataBase;

    try {
      mailConfig = getMailConfig(action);

      const templateUrl = join(
        process.cwd(),
        'src',
        'shared',
        'modules',
        'mail',
        'templates',
        `${mailConfig.templateName}.ejs`,
      );

      html = await renderFile(
        join(
          process.cwd(),
          'src',
          'shared',
          'modules',
          'mail',
          'templates',
          'base',
          'index.ejs',
        ),
        {
          templateUrl,
          title: mailConfig.title,
          ...data.templateData,
        },
      );
    } catch (err) {
      console.log('error2:', err);
      return false;
    }

    try {
      await this.sendGrid.send({
        to: data.to,
        from: this.configService.get(ConfigEnum.MAIL_FROM),
        subject: mailConfig.subject,
        html,
      });
    } catch (err) {
      console.log('error3:', err);
      console.log(html);
      return false;
    } finally {
      console.log(html);
    }

    return true;
  }
}
