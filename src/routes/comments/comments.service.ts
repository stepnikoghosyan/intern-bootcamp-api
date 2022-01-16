import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions } from 'sequelize/types/lib/model';

// services
import { BaseService } from '../../shared/base.service';
import { PostsService } from '../posts/posts.service';

// entities
import { Comment } from './comment.entity';

// dto
import { CreateOrUpdateCommentDto } from './dto/createOrUpdateCommentDto';

// models
import { IPaginationResponse } from '../../shared/interfaces/pagination-response.model';
import { ICommentQueryParams } from './interfaces/comment-query-params.model';
import { User } from '../users/user.entity';
import { Attachment } from '../../modules/attachments/attachment.entity';
import { getProfilePictureUrl } from '../../shared/helpers/profile-picture-url.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentsService extends BaseService<Comment> {
  constructor(
    @InjectModel(Comment) private readonly model: typeof Comment,
    private readonly postsService: PostsService,
    private readonly configService: ConfigService,
  ) {
    super(model);
  }

  public async getComments(queryParams?: ICommentQueryParams): Promise<IPaginationResponse<Comment>> {
    if (!queryParams && !queryParams.posts && !queryParams.posts.length) {
      throw new BadRequestException('Post id is required');
    }

    const options: FindAndCountOptions<Comment['_attributes']> = {
      where: {
        postId: queryParams.posts,
      },
      attributes: {
        exclude: ['postId', 'userId'],
      },
      include: [
        {
          model: User,
          include: [{
            model: Attachment,
            attributes: ['fileName'],
          }],
          attributes: {
            exclude: ['password', 'profilePictureId', 'attachment', 'activatedAt', 'createdAt', 'updatedAt'],
          },
        },
      ],
    };

    const { count, rows } = await this.model.findAndCountAll(options);

    return {
      count,
      results: JSON.parse(JSON.stringify(rows)).map(item => {
        if (item.user.attachment?.fileName) {
          item.user.profilePictureUrl = `${getProfilePictureUrl(this.configService, item.user.attachment.fileName)}`;
        } else {
          item.user.profilePictureUrl = null;
        }
        delete item.user.attachment;

        return item;
      }),
    };
  }

  public async createComment(userID: number, postID: number, payload: CreateOrUpdateCommentDto): Promise<Comment> {
    const post = await this.postsService.getByID(postID);
    if (!post) {
      throw new NotFoundException('Post with given id not found');
    }

    return this.model.create({ message: payload.message, postId: postID, userId: userID });
  }

  public async updateComment(userID: number, commentID: number, payload: CreateOrUpdateCommentDto): Promise<Comment> {
    const comment = await this.model.findByPk(commentID);
    if (!comment) {
      throw new NotFoundException('Comment with given id not found');
    }

    await comment.update({ message: payload.message });

    return comment;
  }

  public async deleteComment(userID: number, commentID: number): Promise<void> {
    const comment = await this.model.findOne({
      where: {
        id: commentID,
        userId: userID,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment with given id not found');
    }

    await comment.destroy();
  }
}
