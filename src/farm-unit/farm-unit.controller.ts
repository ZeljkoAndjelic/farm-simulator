import {
  Body,
  Controller,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FarmUnitDto } from 'src/dto/farm.unit.dto';
import { FeedDto } from 'src/dto/feed.dto';
import { FarmUnitService } from './farm-unit.service';

@Controller('farm-unit')
export class FarmUnitController {
  constructor(private readonly farmUnitService: FarmUnitService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  async addFarmUnit(@Body() data: FarmUnitDto) {
    return this.farmUnitService.addFarmUnit(data);
  }

  @Patch('/feed')
  @UsePipes(ValidationPipe)
  async feedFarmUnit(@Body() data: FeedDto) {
    return this.farmUnitService.feedFarmUnit(data);
  }
}
