import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// modules
import { NotificationsModule } from './modules/notifications/notifications.module';

// services
import { MessangerService } from './services/messanger.service';
import { GroupsService } from './services/groups.service';

// controllers
import { MessangerController } from './controllers/messanger.controller';
import { GroupsController } from './controllers/groups.controller';

// entities
import { Message } from './entities/messsage.entity';
import { Group } from './entities/group.entity';

@Module({
  imports: [SequelizeModule.forFeature([Message, Group]), NotificationsModule],
  controllers: [GroupsController, MessangerController],
  providers: [MessangerService, GroupsService],
})
export class MessangerModule {}