import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(dataSource: DataSource) {
    super(FileEntity, dataSource.createEntityManager());
  }
}
