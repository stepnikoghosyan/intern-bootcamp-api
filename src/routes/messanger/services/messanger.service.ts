import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions } from 'sequelize/types/lib/model';

// services
import { BaseService } from '../../../shared/base.service';
import { GroupsService } from './groups.service';

// entities
import { Message } from '../entities/messsage.entity';

// dto
import { CreateOrUpdateMessageDto } from '../dto/message.dto';

// models
import { IPaginationResponse } from '../../../shared/interfaces/pagination-response.model';
import { Group } from "../entities/group.entity";

@Injectable()
export class MessangerService extends BaseService<Message> {
  constructor(
    @InjectModel(Message) private readonly model: typeof Message,
    private readonly groupsService: GroupsService, // private readonly postsService: PostsService, // private readonly configService: ConfigService,
  ) {
    super(model);
  }

  public async getMessagesInGroup(
    groupId: number,
    currentUserId: number,
  ): Promise<IPaginationResponse<Message>> {
    if (!groupId || !(+groupId > 0)) {
      throw new BadRequestException('Group id is required');
    }

    const isUserIncludedInTheGroup =
      await this.groupsService.groupExistsAndUserIncludedInGroup(
        groupId,
        currentUserId,
      );
    if (!isUserIncludedInTheGroup) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const options: FindAndCountOptions<Message['_attributes']> = {
      where: {
        groupId,
      },
      attributes: {
        exclude: ['groupId'],
      },
      // include: [
      //   {
      //     model: User,
      //     include: [
      //       {
      //         model: Attachment,
      //         attributes: ['fileName'],
      //       },
      //     ],
      //     attributes: {
      //       exclude: [
      //         'password',
      //         'profilePictureId',
      //         'attachment',
      //         'activatedAt',
      //         'createdAt',
      //         'updatedAt',
      //       ],
      //     },
      //   },
      // ],
      order: [['createdAt', 'DESC']],
    };

    const rows = await this.model.findAll(options);
    const count = await this.model.count({
      where: {
        groupId,
      },
    });

    return {
      count,
      results: rows,
    };
  }

  public async createMessage(
    userID: number,
    payload: CreateOrUpdateMessageDto,
    groupID?: number,
  ): Promise<Message> {
    if (!groupID && !payload.group) {
      throw new BadRequestException(
        'Either groupId or group must be specified',
      );
    }

    let group: Group;
    if (payload.group) {
      group = await this.groupsService.createGroup(payload.group, userID);
    } else {
      group = await this.groupsService.getByID(groupID);
      if (!group) {
        throw new NotFoundException('Group with given id not found');
      }
    }

    return this.model.create({
      content: payload.content,
      senderId: userID,
      groupId: groupID,
    });
  }

  public async updateMessage(
    userID: number,
    messageID: number,
    payload: CreateOrUpdateMessageDto,
  ): Promise<Message> {
    const message = await this.model.findOne({
      where: {
        messageId: messageID,
        senderId: userID,
      },
    });

    if (!message) {
      throw new NotFoundException('Message with given id not found');
    }

    await message.update({ message: payload.content });

    return message;
  }

  public async deleteMessage(userID: number, messageID: number): Promise<void> {
    const message = await this.model.findOne({
      where: {
        id: messageID,
        senderId: userID,
      },
    });

    if (!message) {
      throw new NotFoundException('Message with given id not found');
    }

    await message.destroy();
  }
}
