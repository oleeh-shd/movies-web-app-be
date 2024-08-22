import { WithIdAndTimestampEntity } from 'src/common/entities/with-id-and-timestamp.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('movies')
export class MovieEntity extends WithIdAndTimestampEntity {
  @Column({ name: 'title', type: 'varchar', length: 93 })
  title: string;

  @Column({
    name: 'publishing_year',
    type: 'int2',
  })
  publishingYear: number;

  @OneToOne(() => FileEntity, { nullable: false })
  @JoinColumn({
    name: 'poster_id',
    referencedColumnName: 'id',
  })
  poster?: FileEntity;
}
