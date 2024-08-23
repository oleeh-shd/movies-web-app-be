import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({
    type: String,
    example: 'qwe@qwe.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'asdqwezxc',
  })
  accessToken: string;
}
