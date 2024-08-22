import { WithIdAndTimestampEntity } from 'src/common/entities/with-id-and-timestamp.entity';
import { Column, Entity } from 'typeorm';
import { FileTypeEnum } from '../enums/file-type.enum';

@Entity({ name: 'files' })
export class FileEntity extends WithIdAndTimestampEntity {
  @Column({
    name: 'key',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  key: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: FileTypeEnum,
    nullable: false,
  })
  type: FileTypeEnum;
}
