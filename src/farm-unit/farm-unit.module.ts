import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingEntity } from 'src/entities/building.entity';
import { FarmUnitEntity } from 'src/entities/farm.unit.entity';
import { FarmUnitController } from './farm-unit.controller';
import { FarmUnitService } from './farm-unit.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingEntity, FarmUnitEntity])],
  controllers: [FarmUnitController],
  providers: [FarmUnitService],
})
export class FarmUnitModule {}
