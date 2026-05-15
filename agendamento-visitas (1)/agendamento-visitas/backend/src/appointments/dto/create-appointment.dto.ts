import { IsDateString, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBusinessHour } from '../../common/validators/business-hour.validator';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2026-05-12T14:00:00.000Z',
    description:
      'Início do agendamento em ISO 8601. Deve ser seg–sex, 09–17h em horas cheias.',
  })
  @IsDateString({}, { message: 'startTime deve estar no formato ISO 8601' })
  @IsBusinessHour()
  startTime: string;

  @ApiProperty({ example: 'Visita técnica ao laboratório de redes' })
  @IsString()
  @MinLength(3, { message: 'A descrição deve ter pelo menos 3 caracteres' })
  @MaxLength(500)
  reason: string;
}
