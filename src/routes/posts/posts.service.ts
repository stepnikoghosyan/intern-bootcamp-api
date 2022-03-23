import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions } from 'sequelize/types/lib/model';
import { Op } from 'sequelize';

// services
import { BaseService } from '../../shared/base.service';
import { AttachmentsService } from '../../modules/attachments/attachments.service';
import { ConfigService } from '@nestjs/config';

// entities
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { Attachment } from '../../modules/attachments/attachment.entity';

// dto
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

// models
import { IPostQueryParams } from './interfaces/post-query-params.model';
import { IPaginationResponse } from '../../shared/interfaces/pagination-response.model';
import { ConfigEnum } from '../../shared/interfaces/config-enum.enum';

// helpers
import { getProfilePictureUrl } from '../../shared/helpers/profile-picture-url.helper';
import { Comment } from '../comments/comment.entity';

@Injectable()
export class PostsService extends BaseService<Post> {
  constructor(
    @InjectModel(Post) private readonly model: typeof Post,
    private readonly attachmentsService: AttachmentsService,
    private readonly configService: ConfigService,
  ) {
    super(model);
  }

  public async getPostByID(id: number): Promise<Post> {
    const options: FindAndCountOptions<Post['_attributes']> = {
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: Attachment,
              attributes: ['fileName'],
            },
          ],
          attributes: {
            exclude: [
              'password',
              'profilePictureId',
              'attachment',
              'activatedAt',
              'createdAt',
              'updatedAt',
            ],
          },
        },
        {
          model: Attachment,
          attributes: ['fileName'],
        },
        {
          model: Comment,
          attributes: {
            exclude: ['postId', 'userId'],
          },
          include: [
            {
              model: User,
              include: [
                {
                  model: Attachment,
                  attributes: ['fileName'],
                },
              ],
              attributes: {
                exclude: [
                  'password',
                  'profilePictureId',
                  'attachment',
                  'activatedAt',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ['imageId', 'userId', 'activatedAt'],
        // include: [[Sequelize.col('attachment.fileName'), 'imageUrl']],
      },
    };

    const post = await this.model.findByPk(id, options);

    if (!post) {
      throw new NotFoundException('Post with given id not found');
    }

    const data = JSON.parse(JSON.stringify(post));

    // post
    if (data.attachment?.fileName) {
      data.imageUrl = `${this.postImageUrl}/${data.attachment.fileName}`;
    } else {
      data.imageUrl = null;
    }
    delete data.attachment;

    // user
    if (data.user.attachment?.fileName) {
      data.user.profilePictureUrl = getProfilePictureUrl(
        this.configService,
        data.user.attachment.fileName,
      );
    } else {
      data.user.profilePictureUrl = null;
    }
    delete data.user.attachment;

    // comment
    data.comments.map((comment) => {
      if (comment.user.attachment?.fileName) {
        comment.user.profilePictureUrl = getProfilePictureUrl(
          this.configService,
          comment.user.attachment.fileName,
        );
      } else {
        comment.user.profilePictureUrl = null;
      }
      delete comment.user.attachment;
    });

    return data;
  }

  public async getPosts(
    queryParams?: IPostQueryParams,
  ): Promise<IPaginationResponse<Post>> {
    const options: FindAndCountOptions<Post['_attributes']> = {
      ...this.getPaginationValues(queryParams),
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: Attachment,
              attributes: ['fileName'],
            },
          ],
          attributes: {
            exclude: [
              'password',
              'profilePictureId',
              'attachment',
              'activatedAt',
              'createdAt',
              'updatedAt',
            ],
          },
        },
        {
          model: Attachment,
          attributes: ['fileName'],
        },
        {
          model: Comment,
          attributes: {
            exclude: ['postId', 'userId'],
          },
          include: [
            {
              model: User,
              include: [
                {
                  model: Attachment,
                  attributes: ['fileName'],
                },
              ],
              attributes: {
                exclude: [
                  'password',
                  'profilePictureId',
                  'attachment',
                  'activatedAt',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ['imageId', 'userId', 'activatedAt', 'createdAt', 'updatedAt'],
        // include: [[Sequelize.col('attachment.fileName'), 'imageUrl']],
      },
    };

    const whereClause: { userId?: number; title?: any } = {};

    if (queryParams.userID) {
      whereClause.userId = queryParams.userID;
    }

    if (queryParams.title?.trim()) {
      whereClause.title = {
        [Op.like]: '%' + queryParams.title.trim() + '%',
      };
    }

    options.where = whereClause;

    const { rows, count } = await this.model.findAndCountAll(options);
    return {
      count: count,
      results: JSON.parse(JSON.stringify(rows)).map((item) => {
        // post
        if (item.attachment?.fileName) {
          item.imageUrl = `${this.postImageUrl}/${item.attachment.fileName}`;
        } else {
          item.imageUrl = null;
        }
        delete item.attachment;

        // user
        if (item.user.attachment?.fileName) {
          item.user.profilePictureUrl = getProfilePictureUrl(
            this.configService,
            item.user.attachment.fileName,
          );
        } else {
          item.user.profilePictureUrl = null;
        }
        delete item.user.attachment;

        // comment
        item.comments.map((comment) => {
          if (comment.user.attachment?.fileName) {
            comment.user.profilePictureUrl = getProfilePictureUrl(
              this.configService,
              comment.user.attachment.fileName,
            );
          } else {
            comment.user.profilePictureUrl = null;
          }
          delete comment.user.attachment;
        });

        return item;
      }),
    };
  }

  public async create(
    userID: number,
    payload: CreatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const createData = {
      title: payload.title,
      body: payload.body,
      userId: userID,
      imageId: null,
    };

    if (!!file) {
      const attachment = await this.attachmentsService.createOrUpdate(
        this.postImagesPathInStorage,
        null,
        file,
      );
      if (!!attachment) {
        createData.imageId = attachment.id;
      }
    }

    return this.model.create(createData);
  }

  public async update(
    userID: number,
    postID: number,
    payload: UpdatePostDto,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.model.findOne({
      where: {
        id: postID,
      },
    });

    if (!post) {
      throw new NotFoundException('Post by given id not found');
    }

    if (post.userId !== userID) {
      throw new ForbiddenException('You cannot edit this post');
    }

    const dataForUpdate: Partial<Post> = {
      title: payload.title || post.title,
      body: payload.body || post.body,
    };

    if (!!file) {
      const attachment = await this.attachmentsService.createOrUpdate(
        this.postImagesPathInStorage,
        post.imageId,
        file,
      );
      if (!!attachment) {
        dataForUpdate.imageId = attachment.id;
      }
    }

    await post.update(dataForUpdate);

    return post;
  }

  public async deletePost(userID: number, postID: number): Promise<void> {
    const post = await this.model.findOne({
      where: {
        id: postID,
        userId: userID,
      },
    });

    if (!post) {
      throw new NotFoundException('Post with given id was not found');
    }

    await post.destroy();
  }

  private get postImagesPathInStorage(): string {
    const names = [
      ConfigEnum.ROOT_STORAGE_PATH,
      ConfigEnum.IMAGES_PATH,
      ConfigEnum.POSTS_IMAGES_PATH,
    ];
    return names.map((item) => this.configService.get(item)).join('/');
  }

  private get postImageUrl(): string {
    const names = [
      ConfigEnum.DOMAIN,
      ConfigEnum.ROOT_PUBLIC_STORAGE_PATH,
      ConfigEnum.IMAGES_PATH,
      ConfigEnum.POSTS_IMAGES_PATH,
    ];
    return names.map((item) => this.configService.get(item)).join('/');
  }
}
