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
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { MessageDto } from 'src/common/dtos/message.dto';
import { GetMovieListResponseDto } from './dto/get-movie-list-response.dto';
import { UploadPosterResponseDto } from './dto/upload-poster-response.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOkResponse({ type: () => MessageDto })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: () => MessageDto })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Get()
  @ApiOkResponse({ type: () => GetMovieListResponseDto })
  getMovieList(@Query() limitOffset: LimitOffsetQueryDto) {
    return this.moviesService.getMovieList(limitOffset);
  }

  @Post('/upload')
  @ApiResponse({ type: () => UploadPosterResponseDto })
  @ApiFileConsume()
  @UseInterceptors(FileInterceptor('file'))
  uploadProjectHeader(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.moviesService.uploadPoster(file);
  }
}
