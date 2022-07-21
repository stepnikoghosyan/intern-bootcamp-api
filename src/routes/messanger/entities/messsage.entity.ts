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

  @Column({ allowNull: false })
  @ForeignKey(() => User)
  senderId: number;

  @BelongsTo(() => Group)
  group: Group;

  @Column({ allowNull: false })
  @ForeignKey(() => Group)
  groupId: number;
}
