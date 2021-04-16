import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FarmUnitDto } from 'src/dto/farm.unit.dto';
import { BuildingEntity } from 'src/entities/building.entity';
import { FarmUnitEntity } from 'src/entities/farm.unit.entity';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { differenceInSeconds, subSeconds } from 'date-fns';

@Injectable()
export class FarmUnitService {
  constructor(
    @InjectRepository(FarmUnitEntity)
    private readonly farmUnitRepository: Repository<FarmUnitEntity>,
    @InjectRepository(BuildingEntity)
    private readonly buildingRepository: Repository<BuildingEntity>,
  ) {}

  public async addFarmUnit(data: FarmUnitDto) {
    const { buildingId, farmUnitName } = data;
    try {
      const bld = await this.buildingRepository.findOne({
        where: { id: buildingId },
      });

      if (!bld) throw new Error('No farm building found');

      const farmUnit = this.farmUnitRepository.create();
      farmUnit.name = farmUnitName;
      farmUnit.health = _.random(50, 100);
      farmUnit.building = bld;

      await farmUnit.save();

      return farmUnit;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  public async feedFarmUnit(data: { id: string }) {
    try {
      const frmu = await this.farmUnitRepository.findOne({
        where: { id: data.id },
      });
      if (!frmu)
        throw new HttpException('Farm unit not found', HttpStatus.NOT_FOUND);

      if (!frmu.alive)
        throw new HttpException(
          'Farm unit is dead',
          HttpStatus.PRECONDITION_FAILED,
        );

      if (frmu.health === 100)
        throw new HttpException(
          'Farm unit is fully fed',
          HttpStatus.PRECONDITION_FAILED,
        );

      const coolDown = differenceInSeconds(
        Date.now(),
        frmu.lastTimeManuallyFed,
      );

      if (coolDown < 5)
        throw new HttpException(
          'Feeding not possible',
          HttpStatus.TOO_MANY_REQUESTS,
        );

      frmu.health = frmu.health + 1;
      frmu.lastTimeManuallyFed = new Date();

      await frmu.save();
      frmu.reload();

      return frmu;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
