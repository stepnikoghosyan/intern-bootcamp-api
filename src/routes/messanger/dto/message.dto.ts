import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// dto
import { GroupDto } from './group.dto';

export class CreateOrUpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024, {
    message: 'Message should be smaller than or equal to 1024 characters',
  })
  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @IsOptional({})
  group?: GroupDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  groupId?: number;
}
