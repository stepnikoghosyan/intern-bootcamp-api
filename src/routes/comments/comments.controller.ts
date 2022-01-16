import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

// services
import { CommentsService } from './comments.service';

// entities
import { User } from '../users/user.entity';

// dto
import { CreateOrUpdateCommentDto } from './dto/createOrUpdateCommentDto';

// models
import { ICommentQueryParams } from './interfaces/comment-query-params.model';

// custom decorators
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'showAll', type: Boolean, required: false })
  @ApiQuery({ name: 'posts', type: [Number], required: true })
  @HttpCode(200)
  public get(@Query() queryParams?: ICommentQueryParams) {
    return this.commentsService.getComments(queryParams);
  }

  @Post('/:postID')
  @HttpCode(201)
  public create(
    @Param('postID') postID: number,
    @Body() payload: CreateOrUpdateCommentDto,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.commentsService.createComment(currentUser.id, postID, payload);
  }

  @Put('/:commentID')
  @HttpCode(200)
  public update(
    @Param('commentID') commentID: number,
    @Body() payload: CreateOrUpdateCommentDto,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.commentsService.updateComment(currentUser.id, commentID, payload);
  }

  @Delete('/:id')
  public delete(
    @Param('id') id: number,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.commentsService.deleteComment(currentUser.id, id);
  }
}
