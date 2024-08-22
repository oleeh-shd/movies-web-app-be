import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Name Name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(90)
  title: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 2024,
  })
  @IsNumber()
  @IsPositive()
  @Max(2050)
  publishingYear: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  @IsInt()
  posterId: number;
}
