import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post, Put,
  Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

// services
import { PostsService } from './posts.service';

// entities
import { User } from '../users/user.entity';

// dto
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

// models
import { IPostQueryParams } from './interfaces/post-query-params.model';

// custom decorators
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'showAll', type: Boolean, required: false })
  @ApiQuery({ name: 'userID', type: Number, required: false })
  @HttpCode(200)
  public getPosts(@Query() query: IPostQueryParams) {
    return this.postsService.getPosts(query);
  }

  @Get('/:id')
  @HttpCode(200)
  public getPostById(@Param('id') postID: number) {
    return this.postsService.getPostByID(postID);
  }

  @Post()
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  public create(
    @Body() payload: CreatePostDto,
    @CurrentUser() currentUser: Partial<User>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postsService.create(currentUser.id, payload, file);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  public update(
    @Param('id') postID: number,
    @Body() payload: UpdatePostDto,
    @CurrentUser() currentUser: Partial<User>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postsService.update(currentUser.id, postID, payload, file);
  }

  @Delete('/:id')
  @HttpCode(204)
  public delete(
    @Param('id') postID: number,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.postsService.deletePost(currentUser.id, postID);
  }
}
