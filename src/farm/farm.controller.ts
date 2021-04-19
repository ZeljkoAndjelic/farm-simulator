import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BuildingDto } from 'src/dto/building.dto';
import { BuildingEntity } from 'src/entities/building.entity';
import { FarmUnitEntity } from 'src/entities/farm.unit.entity';
import { FarmService } from './farm.service';

@Controller('farm')
@ApiTags('Farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post('/')
  @ApiOkResponse({ type: FarmUnitEntity })
  @ApiCreatedResponse({ type: FarmUnitEntity })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UsePipes(ValidationPipe)
  async create(@Body() data: BuildingDto) {
    return this.farmService.create(data);
  }

  @Get('/')
  @ApiOkResponse({ type: [BuildingEntity] })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getAllBuildings() {
    return this.farmService.getAllBuildings();
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  @ApiParam({ type: 'string', name: 'id' })
  @ApiOkResponse({ type: [FarmUnitEntity] })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getAllFarmUnits(@Param('id') id: string) {
    return this.farmService.getAllFarmUnits(id);
  }
}
