import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

// entities
import { Attachment } from '../../modules/attachments/attachment.entity';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

@Table
export class Post extends Model {
  @Column({ allowNull: false })
  @ApiProperty()
  title: string;

  @Column({ allowNull: false })
  @ApiProperty()
  body: string;

  @Column({ allowNull: true })
  @ForeignKey(() => Attachment)
  @ApiProperty()
  imageId: number;

  @BelongsTo(() => Attachment)
  attachment: Attachment;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @HasMany(() => Comment)
  comments?: Comment[];
}
