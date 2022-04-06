import { Injectable } from '@nestjs/common';
import { AttachmentsService } from 'src/modules/attachments/attachments.service';
import { UsersService } from '../../routes/users/users.service';
import { PostsService } from '../../routes/posts/posts.service';
import { posts } from './posts';
import { join, resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/shared/interfaces/config-enum.enum';
import { MulterConfigType } from 'src/shared/interfaces/multer-config-type.model';
import { image } from 'image-downloader';
import { users } from './users';
import { IUserItem } from './models/user-item.model';
import { hash } from 'bcrypt';
import { User } from '../../routes/users/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { readdir, unlink } from 'fs';

@Injectable()
export class DemoService {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly configService: ConfigService,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  public async initAll() {
    this.deleteAllFilesInDirectory(this.profilePicturesPathInStorage);
    this.deleteAllFilesInDirectory(this.postImagesPathInStorage);

    await this.deleteAllPosts();
    await this.deleteAllUsers();

    await this.createUsersAndPosts();
  }

  private deleteAllFilesInDirectory(directory: string) {
    readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        unlink(join(directory, file), (err) => {
          if (err) {
            console.log('error');
          }
        });
      }
    });
  }

  private async deleteAllUsers() {
    const users = await this.usersService.getByPagination({ showAll: true });
    for (const user of users.results) {
      await user.destroy();
    }
  }

  private async createUsersAndPosts() {
    const userIDs: number[] = [];

    for (const user of users) {
      const id = await this.createUser(user);
      userIDs.push(id);
    }

    for (const id of userIDs) {
      await this.initPostsForUser(id);
    }
  }

  private async createUser(data: IUserItem) {
    const hashedPassword = await hash(
      data.password,
      +this.configService.get(ConfigEnum.HASH_SALT_ROUNDS),
    );
    const user: User = await this.userModel.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: hashedPassword,
      activatedAt: new Date(),
    });

    if (!!data.imageUrl && !!data.imageType) {
      const fileData = this.getDestination(
        MulterConfigType.profilePictures,
        user.id,
        data.imageType,
      );

      await this.downloadImage(fileData.destination, data.imageUrl);

      const attachment = await this.attachmentsService.createOrUpdate(
        this.profilePicturesPathInStorage,
        null,
        fileData.fileName,
      );

      await user.update({
        profilePictureId: attachment.id,
      });
    }

    return user.id;
  }

  private async deleteAllPosts() {
    const posts = await this.postsService.getByPagination({ showAll: true });
    for (const post of posts.results) {
      await post.destroy();
    }
  }

  private async initPostsForUser(userId: number) {
    for (const item of posts) {
      const post = await this.postsService.create(userId, {
        title: `${item.title} - ${userId}`,
        body: item.body,
      });

      if (!!item.imageUrl && !!item.fileType) {
        const fileData = this.getDestination(
          MulterConfigType.posts,
          userId,
          item.fileType,
        );

        await this.downloadImage(fileData.destination, item.imageUrl);

        const attachment = await this.attachmentsService.createOrUpdate(
          this.postImagesPathInStorage,
          null,
          fileData.fileName,
        );

        await post.update({
          imageId: attachment.id,
        });
      }
    }
  }

  private downloadImage(destination: string, url: string) {
    return image({
      url,
      dest: destination,
      extractFilename: false,
    });
  }

  private getDestination(
    multerConfigType: MulterConfigType,
    userId: number,
    fileType: string,
  ): { destination: string; fileName: string } {
    const filePathConfigs: {
      [key in MulterConfigType]: Array<Partial<ConfigEnum>>;
    } = {
      [MulterConfigType.profilePictures]: [
        ConfigEnum.IMAGES_PATH,
        ConfigEnum.PROFILE_PICTURES_IMAGES_PATH,
      ],
      [MulterConfigType.posts]: [
        ConfigEnum.IMAGES_PATH,
        ConfigEnum.POSTS_IMAGES_PATH,
      ],
    };

    // Root path
    const destination = resolve(
      process.cwd(),
      this.configService.get(ConfigEnum.ROOT_STORAGE_PATH),
      ...filePathConfigs[multerConfigType].map((item) =>
        this.configService.get(item),
      ),
    );

    const date = Date.now().toString(36);
    const fileName = `${userId}_${date}.${fileType}`;

    return {
      destination: resolve(destination, fileName),
      fileName,
    };
  }

  private deleteFileFromStorate(path: string): Promise<void> {
    return new Promise((resolve) => {
      unlink(path, () => resolve());
    });
  }

  private get postImagesPathInStorage(): string {
    const names = [
      ConfigEnum.ROOT_STORAGE_PATH,
      ConfigEnum.IMAGES_PATH,
      ConfigEnum.POSTS_IMAGES_PATH,
    ];
    return names.map((item) => this.configService.get(item)).join('/');
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
