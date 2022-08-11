import { Module } from '@nestjs/common';

// gateway
import { NotificationsGateway } from './notifications.gateway';

@Module({
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
