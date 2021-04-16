import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { BuildingDto } from 'src/dto/building.dto';
import { BuildingEntity } from 'src/entities/building.entity';
import { FarmUnitEntity } from 'src/entities/farm.unit.entity';
import { Connection, Repository } from 'typeorm';
import * as _ from 'lodash';

@Injectable()
export class FarmService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(BuildingEntity)
    private readonly buildingRepository: Repository<BuildingEntity>,
    @InjectRepository(FarmUnitEntity)
    private readonly farmUnitRepository: Repository<FarmUnitEntity>,
  ) {}

  private async transact(data: BuildingDto) {
    const qr = this.connection.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const building = this.buildingRepository.create();
      building.name = data.name;

      await qr.manager.save(building);

      const farmUnit = this.farmUnitRepository.create();
      farmUnit.name = data.farmUnitName;
      farmUnit.health = _.random(50, 100);
      farmUnit.building = building;

      await qr.manager.save(farmUnit);

      await qr.commitTransaction();

      await building.reload();
      await farmUnit.reload();

      return farmUnit;
    } catch (e) {
      await qr.rollbackTransaction();
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    } finally {
      await qr.release();
    }
  }

  public async decrement(id: string) {
    const farmUnit = await this.farmUnitRepository.findOne(FarmUnitEntity, {
      where: { id },
    });

    if (farmUnit.health === 0) {
      farmUnit.alive = false;
      await farmUnit.save();
    }

    farmUnit.health = farmUnit.health - 1;
    await farmUnit.save();
  }

  public async create(data: BuildingDto): Promise<any | FarmUnitEntity> {
    const res = await this.transact(data);
    return res;
  }

  public async getAllBuildings() {
    try {
      const qb = this.buildingRepository.createQueryBuilder('building');

      return qb
        .leftJoinAndSelect('building.farmUnit', 'fu')
        .loadRelationCountAndMap('building.farmUnitCount', 'building.farmUnit')
        .getMany();
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  getAllFarmUnits(id: string) {
    try {
      const qb = this.buildingRepository.createQueryBuilder('building');

      return qb
        .leftJoinAndSelect('building.farmUnit', 'fu')
        .where('building.id = :id', { id: id })
        .getMany();
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
