import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class LimitOffsetQueryDto {
  @ApiProperty({
    type: Number,
    required: false,
    default: 50,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit: number;

  @ApiProperty({
    type: Number,
    required: false,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset: number;
}
