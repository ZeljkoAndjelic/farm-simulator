import { IsString } from 'class-validator';

export class BuildingDto {
  @IsString()
  name: string;

  @IsString()
  farmUnitName: string;
}
