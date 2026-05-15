import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { AvailableSlotsResponse } from '../types';
import { format } from 'date-fns';

function nextWeekday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return format(d, 'yyyy-MM-dd');
}

export function NewAppointment() {
  const navigate = useNavigate();
  const [date, setDate] = useState(nextWeekday());
  const [slotsData, setSlotsData] = useState<AvailableSlotsResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedSlot(null);
    setError(null);
    api
      .get<AvailableSlotsResponse>(`/appointments/available-slots?date=${date}`)
      .then((res) => setSlotsData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message ?? 'Erro ao carregar slots'),
      );
  }, [date]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Escolha um horário.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/appointments', { startTime: selectedSlot, reason });
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Erro ao agendar');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Novo agendamento</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            type="date"
            required
            value={date}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Apenas dias úteis (segunda a sexta) são aceitos.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Horário disponível
          </label>
          {slotsData?.weekend ? (
            <p className="text-sm text-red-600">
              Final de semana — escolha um dia útil.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {slotsData?.slots.map((s) => (
                <button
                  key={s.startTime}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s.startTime)}
                  className={`py-2 rounded border text-sm transition ${
                    selectedSlot === s.startTime
                      ? 'bg-brand-600 text-white border-brand-600'
                      : s.available
                        ? 'bg-white hover:bg-brand-50 border-gray-300'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                  }`}
                >
                  {s.hour}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Horários riscados já estão ocupados ou já passaram.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Motivo da visita
          </label>
          <textarea
            required
            minLength={3}
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Ex: Visita técnica ao laboratório de redes"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting || !selectedSlot}
            className="bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting ? 'Agendando...' : 'Confirmar agendamento'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
