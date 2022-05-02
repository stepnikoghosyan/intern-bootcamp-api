import { BaseService } from '../../shared/base.service';
import { Injectable } from '@nestjs/common';
import { Attachment } from './attachment.entity';
import { InjectModel } from '@nestjs/sequelize';
import { resolve } from 'path';
import { unlink } from 'fs';

@Injectable()
export class AttachmentsService extends BaseService<Attachment> {
  constructor(
    @InjectModel(Attachment) private readonly model: typeof Attachment,
  ) {
    super(model);
  }

  public getAttachmentById(id: number): Promise<Attachment | null> {
    return !!id ? this.model.findByPk(id) : null;
  }

  public async createOrUpdate(
    basePath: string,
    previousAttachmentID: number,
    fileName: string,
  ): Promise<Attachment> {
    let resultAttachment: Attachment;

    // Update
    const currentAttachment = await this.getAttachmentById(
      previousAttachmentID,
    );
    if (!!currentAttachment) {
      const previousAttachmentFileName = currentAttachment.fileName;

      // Update attachment fileName
      await currentAttachment.update({
        fileName,
      });

      // Delete previous file from storage
      await this.deleteExistingAttachment(
        resolve(basePath, previousAttachmentFileName),
      );

      resultAttachment = currentAttachment;
    } else {
      // Create
      resultAttachment = await this.model.create({ fileName });
    }

    return resultAttachment;
  }

  private deleteExistingAttachment(path: string): Promise<void> {
    return new Promise((resolve) => {
      unlink(path, () => resolve());
    });
  }
}
