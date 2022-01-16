import { IsEmail, IsNotEmpty } from 'class-validator';

// models
import { IForgotPassword } from './forgot-password.model';
import { ISignupSuccess } from './signup-success.model';

export interface IMailActions {
  SIGNUP_SUCCESS: ISignupSuccess;
  FORGOT_PASSWORD: IForgotPassword;
  EMAIL_CHANGED: ISignupSuccess;
}

export enum MailActions {
  SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  EMAIL_CHANGED = 'EMAIL_CHANGED'
}

export class MailTemplateData<T extends keyof IMailActions> {

  @IsNotEmpty()
  @IsEmail()
  public to: string;

  constructor(to: string, public templateData: IMailActions[T]) {
    this.to = to;
  }
}
