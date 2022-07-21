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
import { MessangerService } from '../services/messanger.service';

// entities
import { User } from 'src/routes/users/user.entity';

// dto
import { CreateOrUpdateMessageDto } from '../dto/message.dto';

// custom decorators
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiTags('messanger')
@ApiBearerAuth()
@Controller('messanger')
export class MessangerController {
  constructor(private readonly messangerService: MessangerService) {}

  @Get('/:groupID')
  @HttpCode(200)
  public get(
    @Param('groupID') groupID: number,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.messangerService.getMessagesInGroup(groupID, currentUser.id);
  }

  @Post('')
  @HttpCode(201)
  public create(
    @Body() payload: CreateOrUpdateMessageDto,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.messangerService.createMessage(
      currentUser.id,
      payload,
      payload.groupId,
    );
  }

  @Put('/:messageID')
  @HttpCode(200)
  public update(
    @Param('messageID') messageID: number,
    @Body() payload: CreateOrUpdateMessageDto,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.messangerService.updateMessage(
      currentUser.id,
      messageID,
      payload,
    );
  }

  @Delete('/:id')
  public delete(
    @Param('id') id: number,
    @CurrentUser() currentUser: Partial<User>,
  ) {
    return this.messangerService.deleteMessage(currentUser.id, id);
  }
}
