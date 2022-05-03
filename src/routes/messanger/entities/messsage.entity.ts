import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { TEXT } from 'sequelize';

// entities
import { User } from 'src/routes/users/user.entity';
import { Group } from './group.entity';

@Table
export class Message extends Model {
  @Column({ allowNull: false, type: TEXT({ length: 'long' }) })
  @ApiProperty()
  content: string;

  @BelongsTo(() => User)
  sender: User;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  senderId: number;

  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => Group)
  @Column({ allowNull: false })
  groupId: number;
}
