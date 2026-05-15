import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserType } from '../auth/current-user.decorator';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo agendamento' })
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(user, dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Lista agendamentos do usuário autenticado (ou todos se ADMIN).',
  })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.appointmentsService.findAll(user);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Lista horários disponíveis em uma data' })
  availableSlots(@Query() query: AvailableSlotsQueryDto) {
    return this.appointmentsService.availableSlots(query.date);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancela um agendamento' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.appointmentsService.cancel(id, user);
  }
}
