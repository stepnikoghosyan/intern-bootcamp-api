import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

// entities
import { User } from 'src/routes/users/user.entity';
import { Group } from './group.entity';

@Table
export class GroupMember extends Model {
  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
