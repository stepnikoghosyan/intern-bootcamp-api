import { User } from './routes/users/user.entity';
import { Token } from './modules/tokens/tokens.entity';
import { Attachment } from './modules/attachments/attachment.entity';
import { Post } from './routes/posts/post.entity';
import { Comment } from './routes/comments/comment.entity';
import { Message } from './routes/messanger/entities/messsage.entity';
import { Group } from './routes/messanger/entities/group.entity';
import { GroupMember } from './routes/messanger/entities/group-member.entity';

export function getEntitiesList(): any[] {
  return [User, Token, Attachment, Post, Comment, Group, Message, GroupMember];
}
