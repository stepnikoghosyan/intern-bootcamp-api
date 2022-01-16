import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

// modules
import { AttachmentsModule } from '../../modules/attachments/attachments.module';

// services
import { PostsService } from './posts.service';

// controllers
import { PostsController } from './posts.controller';

// entities
import { Post } from './post.entity';

// helpers
import { multerConfigFactory } from '../../shared/helpers/multer-config-factory.helper';

// models
import { MulterConfigType } from '../../shared/interfaces/multer-config-type.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Post]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: multerConfigFactory(MulterConfigType.posts),
    }),
    AttachmentsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {
}
