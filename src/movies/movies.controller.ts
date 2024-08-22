import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFileConsume } from 'src/common/decorators/files.decorator';
import { LimitOffsetQueryDto } from 'src/common/dtos/limit-offset-query.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessageDto } from 'src/common/dtos/message.dto';
import { GetMovieListResponseDto } from './dto/get-movie-list-response.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOkResponse({ type: () => MessageDto })
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiOkResponse({ type: () => MessageDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @ApiOkResponse({ type: () => GetMovieListResponseDto })
  @Get()
  getMovieList(@Query() limitOffset: LimitOffsetQueryDto) {
    return this.moviesService.getMovieList(limitOffset);
  }

  @Post('/upload')
  @ApiFileConsume()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadProjectHeader(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<number> {
    return await this.moviesService.uploadPoster(file);
  }
}
