import { ApiProperty } from '@nestjs/swagger';
import { FileTypeEnum } from '../enums/file-type.enum';

export class CreateFileDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: '077a78e7-9990-4b67-bf48-4ca24fddedf5.png',
  })
  key: string;

  @ApiProperty({
    example: FileTypeEnum.PNG,
  })
  type: FileTypeEnum;
}
