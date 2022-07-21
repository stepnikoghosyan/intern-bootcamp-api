import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// services
import { GroupsService } from '../services/groups.service';

// entities
import { User } from 'src/routes/users/user.entity';

// dto
import { GroupDto } from '../dto/group.dto';

// custom decorators
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiTags('messanger')
@ApiBearerAuth()
@Controller('messanger/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('user-groups')
  @HttpCode(200)
  public getUserGroups(@CurrentUser() currentUser: Partial<User>) {
    return this.groupsService.getGroupsByUser(currentUser.id);
  }

  @Get(':id')
  @HttpCode(200)
  public getById(
    @Param('id') id: number,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.groupsService.getGroupById(id, currentUser.id);
  }

  @Post(':groupID')
  @HttpCode(201)
  public create(
    @Body() payload: GroupDto,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.groupsService.createGroup(payload, currentUser.id);
  }

  @Put(':groupID')
  @HttpCode(200)
  public update(
    @Param('groupID') groupID: number,
    @Body() payload: GroupDto,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.groupsService.updateGroup(groupID, currentUser.id, payload);
  }

  @Delete(':id')
  public delete(
    @Param('id') id: number,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.groupsService.deleteGroup(id, currentUser.id);
  }
}
