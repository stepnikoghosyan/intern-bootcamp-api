import { Module } from '@nestjs/common';
import { AttachmentsModule } from 'src/modules/attachments/attachments.module';
import { UsersModule } from '../../routes/users/users.module';
import { PostsModule } from '../../routes/posts/posts.module';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../routes/users/user.entity';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AttachmentsModule,
    SequelizeModule.forFeature([User]),
  ],
  providers: [DemoService],
  controllers: [DemoController],
  exports: [],
})
export class DemoModule {}
