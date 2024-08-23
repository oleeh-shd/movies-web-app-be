import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { FilesModule } from './files/files.module';
import { CustomConfigModule } from './custom-config/custom-config.module';
import { MovieEntity } from './movies/entities/movie.entity';
import { FileEntity } from './files/entities/file.entity';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [MovieEntity, FileEntity, UserEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([]),
    MoviesModule,
    AwsS3Module,
    FilesModule,
    CustomConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
