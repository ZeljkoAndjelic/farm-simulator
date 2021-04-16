import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BuildingDto } from 'src/dto/building.dto';
import { FarmService } from './farm.service';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}
  @Post('/')
  @UsePipes(ValidationPipe)
  async create(@Body() data: BuildingDto) {
    return this.farmService.create(data);
  }

  @Get('/')
  async getAllBuildings() {
    return this.farmService.getAllBuildings();
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async getAllFarmUnits(@Param('id') id: string) {
    return this.farmService.getAllFarmUnits(id);
  }
}
