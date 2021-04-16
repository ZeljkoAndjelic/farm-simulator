import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectConnection } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { subSeconds, subYears } from 'date-fns';
import { BuildingEntity } from 'src/entities/building.entity';
import { FarmUnitEntity } from 'src/entities/farm.unit.entity';
import { Connection, Between } from 'typeorm';
import { ulid } from 'ulid';
import * as _ from 'lodash';

@Injectable()
export class TaskService implements OnModuleInit, OnModuleDestroy {
  private FEED_UNIT_CRON_JOB_ID: string;
  private FEED_BUILDING_CRON_JOB_ID: string;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.FEED_UNIT_CRON_JOB_ID = ulid();
    this.FEED_BUILDING_CRON_JOB_ID = ulid();
  }
  onModuleDestroy() {
    this.deleteCron(this.FEED_UNIT_CRON_JOB_ID);
    this.deleteCron(this.FEED_BUILDING_CRON_JOB_ID);
  }

  onModuleInit() {
    this.addFarmUnitCronJob(this.FEED_UNIT_CRON_JOB_ID, '1');
    this.addFarmBuildingCronJob(this.FEED_BUILDING_CRON_JOB_ID, '60');
  }

  private readonly logger = new Logger(TaskService.name);

  async addFarmUnitCronJob(id: string, seconds: string) {
    const job = new CronJob(`*/${seconds} * * * * *`, async () => {
      await this.connection.manager.update(
        FarmUnitEntity,
        {
          lastFed: this.beforeDate(subSeconds(Date.now(), 10)),
          alive: true,
        },
        {
          health: () => 'health - 1',
          lastFed: () => 'NOW()',
          alive: () => 'health > 0',
        },
      );
      this.logger.warn(`job added for each minute at ${seconds} seconds!`);
    });

    this.schedulerRegistry.addCronJob(id, job);

    job.start();
  }

  async addFarmBuildingCronJob(id: string, seconds: string) {
    const job = new CronJob(`*/${seconds} * * * * *`, async () => {
      const buildingIds = await this.connection.manager.find(BuildingEntity, {
        where: {
          lastTimeFedUnits: this.beforeDate(subSeconds(Date.now(), 60)),
        },
      });
      const farmBuildingIds = buildingIds.map(b => b.id);
      const farmUnitIds = _.flatten(buildingIds.map(b => b.farmUnit)).map(
        i => i.id,
      );

      const qbFarmBuilding = this.connection.createQueryBuilder(
        BuildingEntity,
        'bld',
      );

      const qbFarmUnit = this.connection.createQueryBuilder(
        FarmUnitEntity,
        'unit',
      );

      await qbFarmUnit
        .update()
        .set({ health: () => 'health + 3', lastFed: () => 'NOW()' })
        .where('id IN (:...id)', { id: farmUnitIds })
        .andWhere('alive = health > 0')
        .execute();

      await qbFarmBuilding
        .update()
        .set({ lastTimeFedUnits: () => 'NOW()' })
        .where('id IN (:...id)', { id: farmBuildingIds })
        .execute();

      this.logger.warn(`job added for each minute at ${seconds} seconds!`);
    });

    this.schedulerRegistry.addCronJob(id, job);
    job.start();
  }

  deleteCron(id: string) {
    this.schedulerRegistry.deleteCronJob(id);
    this.logger.warn(`job ${id} deleted!`);
  }

  public beforeDate(date: Date) {
    return Between(subYears(date, 100), date);
  }
}
