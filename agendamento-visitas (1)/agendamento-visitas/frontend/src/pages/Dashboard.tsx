import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Appointment } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const { data } = await api.get<Appointment[]>('/appointments');
      setAppointments(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id: number) {
    if (!confirm('Confirmar cancelamento do agendamento?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Erro ao cancelar');
    }
  }

  if (loading) return <p className="mt-8">Carregando agendamentos...</p>;
  if (error) return <p className="mt-8 text-red-600">{error}</p>;

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">
        {user?.role === 'ADMIN' ? 'Todos os agendamentos' : 'Meus agendamentos'}
      </h1>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow">
          Nenhum agendamento ainda. Clique em "+ Novo agendamento" para começar.
        </div>
      ) : (
        <ul className="space-y-3">
          {appointments.map((a) => (
            <li
              key={a.id}
              className="bg-white rounded-lg p-4 shadow flex items-start justify-between"
            >
              <div>
                <div className="font-semibold">
                  {format(new Date(a.startTime), "EEEE, dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-1">{a.reason}</div>
                {user?.role === 'ADMIN' && a.user && (
                  <div className="text-xs text-gray-400 mt-1">
                    Solicitante: {a.user.name} ({a.user.email})
                  </div>
                )}
                <span
                  className={`mt-2 inline-block text-xs px-2 py-1 rounded ${
                    a.status === 'SCHEDULED'
                      ? 'bg-green-100 text-green-800'
                      : a.status === 'CANCELED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {a.status === 'SCHEDULED'
                    ? 'Agendado'
                    : a.status === 'CANCELED'
                      ? 'Cancelado'
                      : 'Concluído'}
                </span>
              </div>
              {a.status === 'SCHEDULED' && (
                <button
                  onClick={() => handleCancel(a.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancelar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
