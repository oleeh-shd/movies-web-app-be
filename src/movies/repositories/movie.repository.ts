import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity';

@Injectable()
export class MovieRepository extends Repository<MovieEntity> {
  constructor(dataSource: DataSource) {
    super(MovieEntity, dataSource.createEntityManager());
  }
}
