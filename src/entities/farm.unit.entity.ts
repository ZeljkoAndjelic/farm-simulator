import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BuildingEntity } from './building.entity';

@Entity()
export class FarmUnitEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'smallint', nullable: false })
  health: number;

  @Column({ type: 'boolean', default: true })
  alive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastTimeManuallyFed?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  lastFed: Date;

  @ManyToOne(
    () => BuildingEntity,
    building => building.farmUnit,
  )
  building: BuildingEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
