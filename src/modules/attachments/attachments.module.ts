import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// services
import { AttachmentsService } from './attachments.service';

// entities
import { Attachment } from './attachment.entity';

@Module({
  imports: [SequelizeModule.forFeature([Attachment])],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
