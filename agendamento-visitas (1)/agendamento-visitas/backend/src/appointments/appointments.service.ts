import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CurrentUserType } from '../auth/current-user.decorator';

@Injectable()
export class AppointmentsService {
  // Constantes da regra de negócio - facilita manutenção e testes
  private readonly SLOT_DURATION_HOURS = 1;
  private readonly OPENING_HOUR = 9;
  private readonly CLOSING_HOUR = 18; // último slot inicia às 17h

  constructor(private prisma: PrismaService) {}

  // ---------- VALIDAÇÃO DE REGRA DE NEGÓCIO (CINTURÃO DE SEGURANÇA) ----------
  // Mesmo o DTO validando, revalidamos no service: defesa em profundidade.
  private assertBusinessHour(date: Date) {
    const day = date.getDay();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    if (day === 0 || day === 6) {
      throw new BadRequestException(
        'Agendamentos não são permitidos aos finais de semana.',
      );
    }
    if (hour < this.OPENING_HOUR || hour >= this.CLOSING_HOUR) {
      throw new BadRequestException(
        `Horário fora do expediente (${this.OPENING_HOUR}h às ${this.CLOSING_HOUR}h).`,
      );
    }
    if (minutes !== 0) {
      throw new BadRequestException(
        'Agendamentos só podem começar em horas cheias.',
      );
    }
  }

  // ---------- CRIAÇÃO ----------
  async create(user: CurrentUserType, dto: CreateAppointmentDto) {
    const startTime = new Date(dto.startTime);
    this.assertBusinessHour(startTime);

    if (startTime <= new Date()) {
      throw new BadRequestException(
        'Não é possível agendar para datas/horários passados.',
      );
    }

    const endTime = new Date(
      startTime.getTime() + this.SLOT_DURATION_HOURS * 60 * 60 * 1000,
    );

    try {
      return await this.prisma.appointment.create({
        data: {
          startTime,
          endTime,
          reason: dto.reason,
          userId: user.id,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });
    } catch (e) {
      // Constraint unique no startTime → duas requisições no mesmo slot
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'Esse horário acabou de ser reservado. Escolha outro.',
        );
      }
      throw e;
    }
  }

  // ---------- LISTAR ----------
  // Usuário comum vê só os próprios; admin vê todos.
  async findAll(user: CurrentUserType) {
    return this.prisma.appointment.findMany({
      where: user.role === 'ADMIN' ? {} : { userId: user.id },
      orderBy: { startTime: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  // ---------- SLOTS DISPONÍVEIS ----------
  // Retorna todos os slots do dia marcando quais estão livres.
  async availableSlots(dateStr: string) {
    const date = new Date(`${dateStr}T00:00:00`);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Data inválida.');
    }

    const day = date.getDay();
    if (day === 0 || day === 6) {
      return { date: dateStr, weekend: true, slots: [] };
    }

    // Pega o intervalo do dia inteiro
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booked = await this.prisma.appointment.findMany({
      where: {
        startTime: { gte: startOfDay, lte: endOfDay },
        status: { not: AppointmentStatus.CANCELED },
      },
      select: { startTime: true },
    });

    const bookedHours = new Set(booked.map((a) => a.startTime.getHours()));
    const now = new Date();

    const slots = [];
    for (let h = this.OPENING_HOUR; h < this.CLOSING_HOUR; h++) {
      const slotTime = new Date(date);
      slotTime.setHours(h, 0, 0, 0);
      slots.push({
        hour: `${String(h).padStart(2, '0')}:00`,
        startTime: slotTime.toISOString(),
        available: !bookedHours.has(h) && slotTime > now,
      });
    }

    return { date: dateStr, weekend: false, slots };
  }

  // ---------- CANCELAR ----------
  async cancel(id: number, user: CurrentUserType) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }
    if (user.role !== 'ADMIN' && appointment.userId !== user.id) {
      throw new ForbiddenException('Você não pode cancelar este agendamento.');
    }
    if (appointment.status === AppointmentStatus.CANCELED) {
      throw new BadRequestException('Este agendamento já está cancelado.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELED },
    });
  }
}
