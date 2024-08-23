import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilesService } from 'src/files/files.service';
import { MovieRepository } from './repositories/movie.repository';
import { isNil, omit } from 'lodash';
import { LimitOffsetQueryDto } from 'src/common/dtos/limit-offset-query.dto';
import { FindManyOptions } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';
import { GetMovieResponseDto } from './dto/get-movie-response.dto';
import { UploadPosterResponseDto } from './dto/upload-poster-response.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly fileService: FilesService,
    private readonly movieRepository: MovieRepository,
  ) {}

  public async create(createMovieDto: CreateMovieDto) {
    await this.movieRepository.save({
      ...createMovieDto,
      poster: { id: createMovieDto.posterId },
    });

    return { message: 'Movie created successfully' };
  }

  public async update(id: number, updateMovieDto: UpdateMovieDto) {
    const existingMovie = await this.movieRepository.findOne({
      where: { id },
      relations: { poster: true },
    });

    if (isNil(existingMovie)) {
      throw new NotFoundException('Movie not found');
    }

    const dataToUpdate = {
      ...omit(updateMovieDto, ['posterId', 'title', 'publishingYear']),
    };

    if (!isNil(updateMovieDto.posterId)) {
      dataToUpdate['poster'] = {
        id: updateMovieDto.posterId,
      };
    }

    if (!isNil(updateMovieDto.title)) {
      dataToUpdate['title'] = updateMovieDto.title;
    }

    if (!isNil(updateMovieDto.publishingYear)) {
      dataToUpdate['publishingYear'] = updateMovieDto.publishingYear;
    }

    await this.movieRepository.update({ id }, dataToUpdate);

    return { message: 'Movie updated successfully' };
  }

  public async uploadPoster(
    file: Express.Multer.File,
  ): Promise<UploadPosterResponseDto> {
    const posterId = await this.fileService.createFile(file);

    return {
      posterId,
    };
  }

  public async getPosterUrlById(id: number): Promise<string> {
    const { key } = await this.fileService.getFileById(id);
    return await this.fileService.getFileByKey(key);
  }

  public async getPosterByKey(key: string): Promise<string> {
    return this.fileService.getFileByKey(key);
  }

  public async getMovieList({ limit, offset }: LimitOffsetQueryDto) {
    const query = {
      order: {
        createdAt: 'DESC',
      },
      relations: {
        poster: true,
      },
      skip: offset,
      take: limit,
    } satisfies FindManyOptions<MovieEntity>;

    const [movies, total] = await this.movieRepository.findAndCount(query);

    return {
      movies: await Promise.all(
        movies.map(async (movie) => this.movieEntityToMovieResponse(movie)),
      ),
      total,
    };
  }

  private async movieEntityToMovieResponse({
    id,
    title,
    publishingYear,
    poster,
  }: MovieEntity): Promise<GetMovieResponseDto> {
    const response = new GetMovieResponseDto();

    response.id = id;
    response.title = title;
    response.publishingYear = publishingYear;
    response.poster = await this.getPosterUrlById(poster.id);

    return response;
  }
}
