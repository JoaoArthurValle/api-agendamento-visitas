import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvailableSlotsQueryDto {
  @ApiProperty({
    example: '2026-05-12',
    description: 'Data no formato YYYY-MM-DD',
  })
  @IsDateString()
  date: string;
}
