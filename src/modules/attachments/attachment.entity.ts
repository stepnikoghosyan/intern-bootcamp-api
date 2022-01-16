import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Attachment extends Model {
  @Column({ allowNull: false })
  fileName: string;
}
