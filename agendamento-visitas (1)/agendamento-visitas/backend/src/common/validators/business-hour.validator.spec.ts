import { IsBusinessHourConstraint } from './business-hour.validator';

describe('IsBusinessHourConstraint', () => {
  const validator = new IsBusinessHourConstraint();
  const fakeArgs: any = {};

  // Helper: cria um ISO string em horário local
  const iso = (date: string) => new Date(date).toISOString();

  describe('horários válidos', () => {
    it('aceita segunda-feira às 09:00', () => {
      // 2026-05-11 é uma segunda-feira
      const d = new Date(2026, 4, 11, 9, 0, 0);
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(true);
    });

    it('aceita sexta-feira às 17:00 (último slot)', () => {
      const d = new Date(2026, 4, 15, 17, 0, 0); // sexta
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(true);
    });

    it('aceita quarta-feira às 12:00', () => {
      const d = new Date(2026, 4, 13, 12, 0, 0);
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(true);
    });
  });

  describe('horários inválidos', () => {
    it('rejeita sábado', () => {
      const d = new Date(2026, 4, 16, 10, 0, 0); // sábado
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(false);
    });

    it('rejeita domingo', () => {
      const d = new Date(2026, 4, 17, 10, 0, 0); // domingo
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(false);
    });

    it('rejeita 08:00 (antes do expediente)', () => {
      const d = new Date(2026, 4, 11, 8, 0, 0);
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(false);
    });

    it('rejeita 18:00 (fora do expediente)', () => {
      const d = new Date(2026, 4, 11, 18, 0, 0);
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(false);
    });

    it('rejeita horário com minutos diferentes de zero', () => {
      const d = new Date(2026, 4, 11, 10, 30, 0);
      expect(validator.validate(d.toISOString(), fakeArgs)).toBe(false);
    });

    it('rejeita valores inválidos / nulos', () => {
      expect(validator.validate(null, fakeArgs)).toBe(false);
      expect(validator.validate('texto-invalido', fakeArgs)).toBe(false);
      expect(validator.validate(undefined, fakeArgs)).toBe(false);
    });
  });
});
