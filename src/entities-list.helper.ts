import { User } from './routes/users/user.entity';
import { Token } from './modules/tokens/tokens.entity';
import { Attachment } from './modules/attachments/attachment.entity';
import { Post } from './routes/posts/post.entity';
import { Comment } from './routes/comments/comment.entity';

export function getEntitiesList(): any[] {
  return [User, Token, Attachment, Post, Comment];
}
