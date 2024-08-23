import { ApiProperty } from '@nestjs/swagger';

export class UploadPosterResponseDto {
  @ApiProperty({ type: Number, example: 1 })
  posterId: number;
}
