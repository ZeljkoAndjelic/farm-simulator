import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingEntity } from 'src/entities/building.entity';
import { FarmUnitEntity } from 'src/entities/farm.unit.entity';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingEntity, FarmUnitEntity])],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
