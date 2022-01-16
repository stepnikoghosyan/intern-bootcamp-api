import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// modules
import { PostsModule } from '../posts/posts.module';

// services
import { CommentsService } from './comments.service';

// controllers
import { CommentsController } from './comments.controller';

// entities
import { Comment } from './comment.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment]),
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {
}
