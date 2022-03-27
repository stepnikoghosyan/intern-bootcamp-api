import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

// services
import { UsersService } from './users.service';

// dto
import { UpdateUserDto } from './dto/update-user.dto';

// models
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from './user.entity';
import { IUsersQueryParams } from './interfaces/users-query-params.model';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'showAll', type: Boolean, required: false })
  @ApiQuery({ name: 'excludeSelf', type: Boolean, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  get(
    @Query() queryParams: IUsersQueryParams,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.usersService.getUsers(queryParams, currentUser.id);
  }

  @Get('my-profile')
  getCurrentUserProfileData(@CurrentUser() currentUser: Partial<User>) {
    return this.usersService.getUserProfileData(currentUser.id);
  }

  @Get('/:id')
  getByID(@Param('id') userID: number) {
    return this.usersService.getUserByID(userID);
  }

  @Put('')
  @HttpCode(204)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture'))
  public updateUser(
    @CurrentUser() currentUser: Partial<User>,
    @Body() payload: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateUser(currentUser.id, payload, file);
  }
}
