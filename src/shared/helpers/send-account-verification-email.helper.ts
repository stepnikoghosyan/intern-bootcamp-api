import { InternalServerErrorException } from '@nestjs/common';

// services
import { MailService } from '../modules/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// models
import { ConfigEnum } from '../interfaces/config-enum.enum';
import { MailActions } from '../modules/mail/models/mail-actions.model';

export async function sendAccountVerificationEmail(data: {
  mailService: MailService;
  configService: ConfigService;
  jwtService: JwtService;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  isUpdateAccountRequest: boolean;
}): Promise<void> {
  const WEB_DOMAIN = data.configService.get(ConfigEnum.WEB_DOMAIN);

  const activationToken = await data.jwtService.signAsync(
    { id: data.user.id },
    {
      privateKey: data.configService.get(ConfigEnum.JWT_PRIVATE_KEY),
      expiresIn: '2h',
      algorithm: data.configService.get(ConfigEnum.JWT_SIGN_ALGORITHM),
    },
  );

  const accountVerificationUrl = [
    WEB_DOMAIN,
    'auth',
    'verify-account',
    activationToken,
  ].join('/');

  const isEmailSent = await data.mailService.sendMail(
    MailActions.SIGNUP_SUCCESS,
    {
      to: data.user.email,
      templateData: {
        user: {
          fullName: `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
        },
        accountVerificationUrl,
      },
    },
  );

  if (!isEmailSent) {
    let msg = 'Registered successfully. Failed to send email.';
    if (data.isUpdateAccountRequest) {
      msg =
        'Updated successfully. Failed to send email to verify new email address.';
    }

    throw new InternalServerErrorException(msg);
  }
}
