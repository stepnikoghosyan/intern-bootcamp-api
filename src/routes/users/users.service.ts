import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { hash } from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { FindAndCountOptions } from 'sequelize/types/lib/model';
import { Op, where } from 'sequelize';

// services
import { BaseService } from '../../shared/base.service';
import { AttachmentsService } from '../../modules/attachments/attachments.service';
import { MailService } from '../../shared/modules/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

// entities
import { User } from './user.entity';
import { Post } from '../posts/post.entity';

// dto
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// models
import { ConfigEnum } from '../../shared/interfaces/config-enum.enum';
import { Attachment } from '../../modules/attachments/attachment.entity';
import { IPaginationResponse } from '../../shared/interfaces/pagination-response.model';

// helpers
import { sendAccountVerificationEmail } from '../../shared/helpers/send-account-verification-email.helper';
import { getProfilePictureUrl } from '../../shared/helpers/profile-picture-url.helper';
import { IUsersQueryParams } from './interfaces/users-query-params.model';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User) private readonly model: typeof User,
    private readonly attachmentsService: AttachmentsService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    super(model);
  }

  public async getUserByID(id: number): Promise<User> {
    const user = await this.model.findByPk(id, {
      include: {
        model: Attachment,
        attributes: ['fileName'],
      },
      attributes: {
        exclude: ['profilePictureId', 'attachment', 'createdAt', 'updatedAt'],
        include: [[Sequelize.col('fileName'), 'profilePictureUrl']],
      },
    });

    if (!user) {
      throw new NotFoundException('User with given id not found');
    }

    const data = JSON.parse(JSON.stringify(user));
    delete data.attachment;
    data.profilePictureUrl = getProfilePictureUrl(
      this.configService,
      data.profilePictureUrl,
    );

    return data;
  }

  public getUserProfileData(id: number): Promise<User> {
    return this.getUserByID(id);
  }

  public getUserByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | undefined> {
    if (includePassword) {
      return this.model.findOne({
        where: { email },
        attributes: {
          include: ['password'],
        },
      });
    }

    return this.model.findOne({ where: { email } });
  }

  public async getUsers(
    queryParams: IUsersQueryParams,
    currentUserId: number,
  ): Promise<IPaginationResponse<any>> {
    const options: FindAndCountOptions<Post['_attributes']> = {
      ...this.getPaginationValues(queryParams),
      include: {
        model: Attachment,
        attributes: ['fileName'],
      },
      attributes: {
        exclude: ['profilePictureId', 'attachment', 'createdAt', 'updatedAt'],
        include: [[Sequelize.col('fileName'), 'profilePictureUrl']],
      },
    };

    let whereClause: { [key: string]: any } = {};

    if (
      !!queryParams.excludeSelf &&
      (queryParams.excludeSelf === 'true' || +queryParams.excludeSelf === 1)
    ) {
      whereClause.id = {
        [Op.not]: currentUserId,
      };
    }

    // console.log('hopar:', queryParams.search.trim().toLocaleLowerCase());

    if (queryParams.search?.trim()) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          {
            firstName: {
              [Op.like]:
                '%' + queryParams.search.trim().toLocaleLowerCase() + '%',
            },
          },
          {
            lastName: {
              [Op.like]:
                '%' + queryParams.search.trim().toLocaleLowerCase() + '%',
            },
          },
        ],
      };
    }

    options.where = whereClause;

    const rows = await this.model.findAll(options);
    const count = await this.model.count({ where: whereClause });

    return {
      count: count,
      results: JSON.parse(JSON.stringify(rows)).map((item) => {
        delete item.attachment;

        item.profilePictureUrl = getProfilePictureUrl(
          this.configService,
          item.profilePictureUrl,
        );
        return item;
      }),
    };
  }

  public async createUser(payload: UserRegisterDto): Promise<Partial<User>> {
    const hashedPassword = await hash(
      payload.password,
      +this.configService.get(ConfigEnum.HASH_SALT_ROUNDS),
    );
    const result: User = await this.model.create({
      ...payload,
      password: hashedPassword,
      activatedAt: null,
    });

    const plainObj = JSON.parse(JSON.stringify(result));
    const { password, ...userData } = plainObj;

    return userData;
  }

  public async updateUser(
    id: number,
    payload: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<any> {
    const user = await this.getByID(id);
    if (!user.activatedAt) {
      throw new ForbiddenException('Account is not activated');
    }

    const dataForUpdate: Partial<User> = {
      firstName: payload.firstName || user.firstName,
      lastName: payload.lastName || user.lastName,
      email: payload.email || user.email,
    };

    if (!!payload.password) {
      const hashedPassword = await hash(
        payload.password,
        +this.configService.get(ConfigEnum.HASH_SALT_ROUNDS),
      );
      dataForUpdate.password = hashedPassword;
    }

    if (!!file) {
      const attachment = await this.attachmentsService.createOrUpdate(
        this.profilePicturesPathInStorage,
        user.profilePictureId,
        file.filename,
      );
      if (!!attachment) {
        dataForUpdate.profilePictureId = attachment.id;
      }
    } else if (!payload.profilePicture && !!user.profilePictureId) {
      // TODO: Add check in IF statement to make sure url in payload is same as current profile picture in db
      // Delete profile picture
      await this.attachmentsService.deleteByID(user.profilePictureId);
      dataForUpdate.profilePictureId = null;
    }

    if (payload.email !== dataForUpdate.email) {
      dataForUpdate.activatedAt = null;
      await user.update(dataForUpdate);

      await sendAccountVerificationEmail({
        mailService: this.mailService,
        configService: this.configService,
        jwtService: this.jwtService,
        user: {
          id: user.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
        },
        isUpdateAccountRequest: true,
      });
    } else {
      await user.update(dataForUpdate);
    }
  }

  public async activateUserAccount(userID: number): Promise<void> {
    // Check if user exists
    const user = await this.getByID(userID);

    // Verify account
    await user.update({
      activatedAt: new Date(),
    });
  }

  public async changeUserPassword(
    userID: number,
    password: string,
  ): Promise<void> {
    if (!userID || !password) {
      throw new BadRequestException('userId ans password are required.');
    }

    const hashedPassword = await hash(
      password,
      +this.configService.get(ConfigEnum.HASH_SALT_ROUNDS),
    );

    await this.model.update(
      {
        password: hashedPassword,
      },
      { where: { id: userID } },
    );
  }

  public async deleteUser(userID: number): Promise<void> {
    const user = await this.getByID(userID);
    if (!user) {
      throw new NotFoundException('User with given id not found');
    }

    if (!!user.profilePictureId) {
      await this.attachmentsService.deleteByID(user.profilePictureId);
    }

    await user.destroy();

    // const attachment = this.attachmentsService.getAttachmentById(user.attachment.id);
  }

  private get profilePicturesPathInStorage(): string {
    const names = [
      ConfigEnum.ROOT_STORAGE_PATH,
      ConfigEnum.IMAGES_PATH,
      ConfigEnum.PROFILE_PICTURES_IMAGES_PATH,
    ];
    return names.map((item) => this.configService.get(item)).join('/');
  }
}
