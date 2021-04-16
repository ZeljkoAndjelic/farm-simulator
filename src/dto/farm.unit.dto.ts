import { IsString } from 'class-validator';

export class FarmUnitDto {
  @IsString()
  buildingId: string;

  @IsString()
  farmUnitName: string;
}
