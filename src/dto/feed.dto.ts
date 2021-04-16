import { IsUUID } from 'class-validator';

export class FeedDto {
  @IsUUID()
  id: string;
}
