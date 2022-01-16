import { UserTokenTypes } from './token-types.model';

export interface IToken {
  id: number;
  userID: number;
  token: string;
  type: UserTokenTypes;
}
