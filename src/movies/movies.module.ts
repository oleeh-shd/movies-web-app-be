import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { FilesService } from 'src/files/files.service';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { FileRepository } from 'src/files/repositories/public-file.repository';
import { AwsS3ConfigService } from 'src/custom-config/aws/aws-s3-config.service';
import { CustomConfigService } from 'src/custom-config/custom-config.service';
import { MovieRepository } from './repositories/movie.repository';

@Module({
  controllers: [MoviesController],
  providers: [
    MoviesService,
    FilesService,
    AwsS3ConfigService,
    AwsS3Service,
    FileRepository,
    CustomConfigService,
    MovieRepository,
  ],
})
export class MoviesModule {}
