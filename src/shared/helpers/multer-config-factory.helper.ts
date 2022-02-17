import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MulterConfigType } from '../interfaces/multer-config-type.model';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { diskStorage } from 'multer';
import { Request } from 'express';
// entities
import { User } from '../../routes/users/user.entity';
// models
import { ConfigEnum } from '../interfaces/config-enum.enum';

export function multerConfigFactory(
  multerConfigType: MulterConfigType,
): (...args) => MulterOptions {
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

  return (configService: ConfigService): MulterOptions => ({
    storage: diskStorage({
      destination: resolve(
        process.cwd(),
        configService.get(ConfigEnum.ROOT_STORAGE_PATH),
        ...filePathConfigs[multerConfigType].map((item) =>
          configService.get(item),
        ),
      ),
      filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
      ) {
        const date = Date.now().toString(36);
        const path = `${
          (req.user as Partial<User>).id
        }_${date}${file.originalname.substring(
          file.originalname.lastIndexOf('.'),
        )}`;

        cb(null, path);
      },
    }),
    limits: {
      files: 1,
      fileSize: 10 * 1024 * 1024, // 10mb
    },
  });
}
