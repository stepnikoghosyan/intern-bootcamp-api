import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { Op } from 'sequelize';

// services
import { BaseService } from 'src/shared/base.service';

// entities
import { Group } from '../entities/group.entity';
import { User } from 'src/routes/users/user.entity';

// dto
import { GroupDto } from '../dto/group.dto';

// models
import { IPaginationResponse } from '../../../shared/interfaces/pagination-response.model';
import { Message } from '../entities/messsage.entity';

@Injectable()
export class GroupsService extends BaseService<Group> {
  constructor(
    @InjectModel(Group) private readonly model: typeof Group,
    private readonly sequelize: Sequelize,
  ) {
    super(model);
  }

  public async getGroupsByUser(
    currentUserId: number,
  ): Promise<IPaginationResponse<Group>> {
    const options = {
      where: {
        '$users.id$': {
          [Op.in]: [currentUserId],
        },
      },
      include: [
        {
          model: User,
          as: 'users',
          through: {
            attributes: [],
          },
        },
      ],
    };

    const rows = await this.model.findAll(options);
    const count = await this.model.count(options);

    return {
      count,
      results: rows,
    };
  }

  public async getGroupById(id: number, currentUserId: number): Promise<Group> {
    const group = await this.model.findOne({
      where: {
        id,
        '$users.id$': {
          [Op.in]: [currentUserId],
        },
      },
      include: [
        {
          model: User,
          as: 'users',
          through: {
            attributes: [],
          },
        },
        {
          model: Message,
        },
      ],
    });

    if (!group) {
      throw new NotFoundException('Group with given id not found');
    }

    return group;
  }

  public async createGroup(
    payload: GroupDto,
    currentUserId: number,
  ): Promise<Group> {
    let transaction: Transaction;

    try {
      transaction = await this.sequelize.transaction();

      const group = await this.model.create(payload, {
        transaction,
        include: [
          {
            model: User,
          },
        ],
      });

      await group.$set('users', [currentUserId, ...payload.userIDs], {
        transaction,
      });

      await transaction.commit();

      return group;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }

      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException('Could not create group');
    }
  }

  public async updateGroup(
    groupID: number,
    currentUserId: number,
    payload: GroupDto,
  ): Promise<Group> {
    let transaction: Transaction;

    try {
      transaction = await this.sequelize.transaction();

      const group = await this.model.findOne({
        where: {
          id: groupID,
          '$users.id$': {
            [Op.in]: [currentUserId],
          },
        },
        transaction,
      });

      if (!group) {
        throw new NotFoundException('Group with given id not found');
      }

      await group.update(
        { ...payload, isPersonal: group.isPersonal },
        { transaction },
      );

      await transaction.commit();

      return group;
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }

      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException('Could not create group');
    }
  }

  public async deleteGroup(
    groupID: number,
    currentUserId: number,
  ): Promise<void> {
    let transaction: Transaction;

    try {
      transaction = await this.sequelize.transaction();

      const group = await this.model.findOne({
        where: {
          id: groupID,
          '$users.id$': {
            [Op.in]: [currentUserId],
          },
        },
        include: [
          {
            model: User,
            as: 'users',
          },
        ],
      });

      if (!group) {
        throw new NotFoundException('Group with given id not found');
      }

      await group.destroy({ transaction });

      await transaction.commit();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }

      if (err instanceof HttpException) {
        throw err;
      }

      throw new InternalServerErrorException('Could not create group');
    }
  }

  public async groupExistsAndUserIncludedInGroup(
    groupId: number,
    userId: number,
  ): Promise<boolean> {
    const group = await this.model.findOne({
      where: {
        id: groupId,
        '$users.id$': {
          [Op.in]: [userId],
        },
      },
      include: [
        {
          model: User,
          as: 'users',
          through: {
            attributes: [],
          },
        },
      ],
    });

    return !!group;
  }
}
