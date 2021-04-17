import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
import { BuildingEntity } from './entities/building.entity';
import { FarmUnitEntity } from './entities/farm.unit.entity';
import { FarmModule } from './farm/farm.module';
import { FarmUnitModule } from './farm-unit/farm-unit.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('mysqlHost', 'localhost'),
          port: 3306,
          username: config.get('mysqlUser'),
          password: config.get('mysqlPassword'),
          database: config.get('mysqlDatabase'),
          entities: [BuildingEntity, FarmUnitEntity],
          synchronize: true,
        };
      },
    }),
    ScheduleModule.forRoot(),
    FarmModule,
    FarmUnitModule,
    TaskModule,
  ],
})
export class AppModule {}
