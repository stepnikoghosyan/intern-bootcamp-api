import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// modules
import { AttachmentsModule } from '../../modules/attachments/attachments.module';
import { MailModule } from '../../shared/modules/mail/mail.module';

// services
import { UsersService } from './users.service';

// controllers
import { UsersController } from './users.controller';

// entities
import { User } from './user.entity';
import { MulterModule } from '@nestjs/platform-express';

// models
import { MulterConfigType } from '../../shared/interfaces/multer-config-type.model';
import { ConfigEnum } from '../../shared/interfaces/config-enum.enum';

// helpers
import { multerConfigFactory } from '../../shared/helpers/multer-config-factory.helper';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ConfigEnum.JWT_PRIVATE_KEY),
        signOptions: {
          algorithm: configService.get<any>(ConfigEnum.JWT_SIGN_ALGORITHM),
          expiresIn: configService.get<string | number>(ConfigEnum.JWT_EXPIRE),
        },
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: multerConfigFactory(MulterConfigType.profilePictures),
    }),
    AttachmentsModule,
    MailModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
}
