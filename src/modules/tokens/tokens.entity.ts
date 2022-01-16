import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserTokenTypes } from './interfaces/token-types.model';

@Table
export class Token extends Model {
  @Column
  userId: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  token: string;

  @Column
  type: UserTokenTypes;
}
