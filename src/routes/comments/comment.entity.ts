import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

// entities
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Table
export class Comment extends Model {
  @Column({ allowNull: false })
  @ApiProperty()
  message: string;

  @BelongsTo(() => Post)
  @ApiProperty()
  post: Post;

  @Column({ allowNull: false })
  @ForeignKey(() => Post)
  @ApiProperty()
  postId: number;

  @BelongsTo(() => User)
  @ApiProperty()
  user: User;

  @Column({ allowNull: false })
  @ForeignKey(() => User)
  @ApiProperty()
  userId: number;
}
