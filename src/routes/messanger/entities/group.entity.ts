import {
  Column,
  BelongsToMany,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { TEXT, BOOLEAN } from 'sequelize';

// entities
import { Message } from './messsage.entity';
import { User } from 'src/routes/users/user.entity';
import { GroupMember } from './group-member.entity';

@Table
export class Group extends Model {
  @Column({ allowNull: false, type: TEXT })
  @ApiProperty()
  name: string;

  @Column({ allowNull: false, type: BOOLEAN, defaultValue: false })
  @ApiProperty()
  isPersonal: boolean;

  @HasMany(() => Message)
  messages?: Message[];

  @BelongsToMany(() => User, () => GroupMember)
  users: Array<User & { GroupMember: GroupMember }>;
}
