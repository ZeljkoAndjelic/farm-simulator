import {
  Body,
  Controller,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { FarmUnitDto } from 'src/dto/farm.unit.dto';
import { FeedDto } from 'src/dto/feed.dto';
import { FarmUnitEntity } from 'src/entities/farm.unit.entity';
import { FarmUnitService } from './farm-unit.service';

@Controller('farm-unit')
@ApiTags('Farm unit')
export class FarmUnitController {
  constructor(private readonly farmUnitService: FarmUnitService) {}

  @Post('/')
  @ApiOkResponse({ type: [FarmUnitEntity] })
  @ApiNotFoundResponse({ description: 'Farm building not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UsePipes(ValidationPipe)
  async addFarmUnit(@Body() data: FarmUnitDto) {
    return this.farmUnitService.addFarmUnit(data);
  }

  @Patch('/feed')
  @ApiOkResponse({ type: FarmUnitEntity })
  @ApiNotFoundResponse({ description: 'Farm unit not found' })
  @ApiTooManyRequestsResponse({ description: 'To many request' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UsePipes(ValidationPipe)
  async feedFarmUnit(@Body() data: FeedDto) {
    return this.farmUnitService.feedFarmUnit(data);
  }
}
