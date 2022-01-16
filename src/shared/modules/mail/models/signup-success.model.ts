/**
 * @description Signup action data model
 * @export
 * @interface ISignupSuccess
 */
export interface ISignupSuccess {
  user: {
    fullName: string;
    email: string;
  };
  accountVerificationUrl: string;
}
