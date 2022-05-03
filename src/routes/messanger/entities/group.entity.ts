import {
  Column,
  BelongsToMany,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { TEXT } from 'sequelize';

// entities
import { Message } from './messsage.entity';
import { User } from 'src/routes/users/user.entity';
import { GroupMember } from './group-member.entity';

@Table
export class Group extends Model {
  @Column({ allowNull: false, type: TEXT })
  @ApiProperty()
  name: string;

  @HasMany(() => Message)
  messages?: Message[];

  @BelongsToMany(() => User, () => GroupMember)
  users: User[];
}
