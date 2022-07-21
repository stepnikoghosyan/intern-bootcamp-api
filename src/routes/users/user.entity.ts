import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

// entities
import { Attachment } from '../../modules/attachments/attachment.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Group } from './../messanger/entities/group.entity';
import { GroupMember } from '../messanger/entities/group-member.entity';

@Table({
  defaultScope: {
    attributes: {
      exclude: ['password'],
    },
  },
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  @ApiProperty()
  email: string;

  @Column({ allowNull: false })
  @ApiProperty()
  firstName: string;

  @Column({ allowNull: false })
  @ApiProperty()
  lastName: string;

  @Column({ allowNull: true })
  @ForeignKey(() => Attachment)
  @ApiProperty()
  profilePictureId: number;

  @BelongsTo(() => Attachment)
  attachment: Attachment;

  @Column({ defaultValue: null, type: DataType.DATE, allowNull: true })
  @ApiProperty()
  activatedAt: Date;

  @Column({ allowNull: false })
  @ApiProperty()
  password: string;

  @HasMany(() => Post)
  posts?: Post[];

  @HasMany(() => Comment)
  comments?: Comment[];

  @BelongsToMany(() => Group, () => GroupMember)
  groups: Array<Group & { GroupMember: GroupMember }>;
}
