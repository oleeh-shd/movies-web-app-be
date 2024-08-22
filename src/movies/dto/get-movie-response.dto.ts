import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

export class GetMovieResponseDto extends PickType(CreateMovieDto, [
  'title',
  'publishingYear',
]) {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({
    type: String,
    example: 'https://meet.google.com/?authuser=0',
  })
  poster: string;
}
