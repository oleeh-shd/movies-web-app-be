import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ type: String, example: 'SomeMessage' })
  message: string;
}
