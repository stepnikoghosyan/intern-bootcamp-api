import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;
}
