import {
  Body,
  Controller,
  Get,
  HttpCode, Param,
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
import { IQueryParams } from '../../shared/interfaces/query-params.model';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from './user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'showAll', type: Boolean, required: false })
  get(@Query() queryParams: IQueryParams) {
    return this.usersService.getUsers(queryParams);
  }

  @Get('my-profile')
  getCurrentUserProfileData(
    @CurrentUser() currentUser: Partial<User>,
  ) {
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
