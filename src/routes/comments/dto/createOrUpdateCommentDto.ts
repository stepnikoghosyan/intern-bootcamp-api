import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {
    message: 'Message should be greather or equal to 255 characters',
  })
  @ApiProperty()
  message: string;
}
