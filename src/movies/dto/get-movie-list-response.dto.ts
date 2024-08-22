import { ApiProperty } from '@nestjs/swagger';
import { GetMovieResponseDto } from './get-movie-response.dto';

export class GetMovieListResponseDto {
  @ApiProperty({ type: () => [GetMovieResponseDto] })
  movies: GetMovieResponseDto[];

  @ApiProperty({ type: Number, example: 1 })
  total: number;
}
