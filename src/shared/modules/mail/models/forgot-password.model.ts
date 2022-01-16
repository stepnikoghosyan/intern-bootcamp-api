export interface IForgotPassword {
  user: {
    fullName: string;
    email: string;
  };
  resetPasswordUrl: string;
}
