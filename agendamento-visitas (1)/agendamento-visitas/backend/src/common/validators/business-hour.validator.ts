import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Valida se a data/hora informada é um slot de agendamento válido:
 *  - Dia da semana: segunda (1) a sexta (5)
 *  - Hora: das 09h até 17h (slot de 1h, último agendamento termina às 18h)
 *  - Minutos: zerados (slots em horas cheias)
 *
 * Esta validação acontece ANTES da requisição entrar no service.
 * A mesma regra é re-aplicada no service como cinturão de segurança.
 */
@ValidatorConstraint({ async: false, name: 'isBusinessHour' })
export class IsBusinessHourConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (!value) return false;
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;

    const day = date.getDay(); // 0 = domingo, 6 = sábado
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const isWeekday = day >= 1 && day <= 5;
    const isOnHour = minutes === 0 && seconds === 0;
    // Início do slot pode ser de 9h até 17h (o de 17h termina às 18h)
    const isBusinessHour = hour >= 9 && hour <= 17;

    return isWeekday && isOnHour && isBusinessHour;
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Agendamentos só podem ser feitos de segunda a sexta, em horários cheios entre 09:00 e 17:00 (último slot termina às 18:00).';
  }
}

export function IsBusinessHour(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBusinessHourConstraint,
    });
  };
}
