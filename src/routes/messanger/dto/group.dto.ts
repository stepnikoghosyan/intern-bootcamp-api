import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ArrayMinSize,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, {
    message: 'Name should be smaller than or equal to 255 characters',
  })
  @ApiProperty()
  name: string;

  @ArrayMinSize(1)
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty()
  userIDs: number[];

  @IsBoolean()
  @ApiProperty()
  isPersonal: boolean;
}
