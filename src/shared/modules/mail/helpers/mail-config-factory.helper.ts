import { IMailDataBase } from '../models/mail-data-base.model';
import { IMailActions } from '../models/mail-actions.model';

type MailConfig = Record<keyof IMailActions, IMailDataBase>;

const mailconfig: MailConfig = {
  SIGNUP_SUCCESS: {
    title: 'Signup success',
    subject: 'signup success',
    templateName: 'signup-success',
  },
  FORGOT_PASSWORD: {
    title: 'Forgot password',
    subject: 'Reset password',
    templateName: 'reset-password',
  },
  EMAIL_CHANGED: {
    title: 'Email changed',
    subject: 'New email verification',
    templateName: 'email-changed',
  },
};

/**
 * @description Gets config for given email action
 * @export
 * @param {keyof IMailActions} action
 * @returns {IMailDataBase}
 */
export function getMailConfig(action: keyof IMailActions): IMailDataBase {
  return mailconfig[action];
}
