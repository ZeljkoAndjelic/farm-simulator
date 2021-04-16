import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FarmUnitEntity } from './farm.unit.entity';

@Entity()
export class BuildingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @CreateDateColumn({ type: 'timestamp' })
  lastTimeFedUnits: Date;

  @OneToMany(
    () => FarmUnitEntity,
    farmUnit => farmUnit.building,
    {
      eager: true,
      nullable: true,
    },
  )
  farmUnit: FarmUnitEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
