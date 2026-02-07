'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SectionCard } from '@/components/SectionCard';
import { weddingConfig } from '@/config/wedding';
import { hasSupabaseConfig, supabase } from '@/lib/supabaseClient';
import { memoryRsvpStore, type RsvpRecord } from '@/lib/rsvpStore';

const deadlineDate = new Date(`${weddingConfig.rsvpDeadline}T23:59:59`);

const emptyForm = {
  name: '',
  phone: '',
  guests_count: 1,
  attending: true,
  dietary: '',
  message: ''
};

export default function RsvpPage() {
  const searchParams = useSearchParams();
  const presetId = searchParams.get('id') ?? '';

  const [formState, setFormState] = useState(emptyForm);
  const [rsvpId, setRsvpId] = useState(presetId);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const isLate = useMemo(() => new Date() > deadlineDate, []);

  useEffect(() => {
    if (presetId) {
      setRsvpId(presetId);
    }
  }, [presetId]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'guests_count' ? Number(value) : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!formState.name || !formState.phone) {
      setStatus('Por favor, preencha nome e telefone.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: rsvpId || crypto.randomUUID(),
        name: formState.name,
        phone: formState.phone,
        guests_count: formState.guests_count,
        attending: formState.attending,
        dietary: formState.dietary || null,
        message: formState.message || null
      };

      let record: RsvpRecord | null = null;

      if (hasSupabaseConfig && supabase) {
        if (rsvpId) {
          const { data, error } = await supabase
            .from('rsvps')
            .update({
              ...payload
            })
            .eq('id', rsvpId)
            .select()
            .single();
          if (error) {
            throw error;
          }
          record = data as RsvpRecord;
        } else {
          const { data, error } = await supabase
            .from('rsvps')
            .insert(payload)
            .select()
            .single();
          if (error) {
            throw error;
          }
          record = data as RsvpRecord;
        }
      } else {
        if (rsvpId) {
          record = await memoryRsvpStore.update(rsvpId, payload);
        } else {
          record = await memoryRsvpStore.create(payload);
        }
      }

      if (!record) {
        throw new Error('Não foi possível salvar sua confirmação.');
      }

      setRsvpId(record.id);
      setStatus(
        `Confirmação enviada com sucesso! Seu código de edição é ${record.id}.`
      );
      setLoaded(true);
    } catch (error) {
      setStatus('Não foi possível enviar. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const loadRsvp = async () => {
    setStatus(null);
    if (!rsvpId) {
      setStatus('Informe o código para editar sua resposta.');
      return;
    }
    setLoading(true);
    try {
      let record: RsvpRecord | null = null;
      if (hasSupabaseConfig && supabase) {
        const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .eq('id', rsvpId)
          .single();
        if (error) {
          throw error;
        }
        record = data as RsvpRecord;
      } else {
        record = await memoryRsvpStore.get(rsvpId);
      }
      if (!record) {
        setStatus('Não encontramos este código.');
        return;
      }
      setFormState({
        name: record.name,
        phone: record.phone,
        guests_count: record.guests_count,
        attending: record.attending,
        dietary: record.dietary ?? '',
        message: record.message ?? ''
      });
      setLoaded(true);
      setStatus('Resposta carregada. Você pode editar abaixo.');
    } catch (error) {
      setStatus('Erro ao carregar sua confirmação.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (presetId) {
      loadRsvp();
    }
  }, [presetId]);

  return (
    <main className="min-h-screen px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-3xl flex-col gap-8"
      >
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sage-500">RSVP</p>
          <h1 className="mt-3 font-display text-3xl text-sage-600">
            Confirmar presença
          </h1>
          <p className="mt-2 text-sm text-warm-600">
            Confirme até {weddingConfig.rsvpDeadlineDisplay}.
          </p>
        </header>

        {isLate ? (
          <SectionCard title="Lista de espera">
            <p>
              O prazo oficial encerrou. Você ainda pode deixar seu nome na lista de
              espera.
            </p>
          </SectionCard>
        ) : null}

        <SectionCard title="Seu código de edição">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              name="rsvpId"
              value={rsvpId}
              onChange={(event) => setRsvpId(event.target.value)}
              placeholder="Cole o código para editar"
              className="flex-1 rounded-full border border-sage-100 px-4 py-2 text-sm"
            />
            <button
              type="button"
              onClick={loadRsvp}
              className="rounded-full bg-sage-500 px-4 py-2 text-sm text-white"
              disabled={loading}
            >
              Buscar
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Formulário">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Nome completo</span>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full rounded-full border border-sage-100 px-4 py-2"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Telefone (WhatsApp)</span>
                <input
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className="w-full rounded-full border border-sage-100 px-4 py-2"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span>Nº de convidados</span>
                <input
                  type="number"
                  min={1}
                  name="guests_count"
                  value={formState.guests_count}
                  onChange={handleChange}
                  className="w-full rounded-full border border-sage-100 px-4 py-2"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Confirmação</span>
                <select
                  name="attending"
                  value={formState.attending ? 'yes' : 'no'}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      attending: event.target.value === 'yes'
                    }))
                  }
                  className="w-full rounded-full border border-sage-100 px-4 py-2"
                >
                  <option value="yes">Vou</option>
                  <option value="no">Não vou</option>
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm">
              <span>Restrições alimentares (opcional)</span>
              <input
                name="dietary"
                value={formState.dietary}
                onChange={handleChange}
                className="w-full rounded-full border border-sage-100 px-4 py-2"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span>Mensagem aos noivos (opcional)</span>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-sage-100 px-4 py-2"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-sage-500 px-4 py-3 text-sm font-medium text-white"
              disabled={loading}
            >
              {loading ? 'Enviando...' : loaded ? 'Atualizar confirmação' : 'Enviar confirmação'}
            </button>

            {status ? (
              <p className="text-center text-sm text-sage-600">{status}</p>
            ) : null}
          </form>
        </SectionCard>

        <Link
          href="/"
          className="text-center text-sm text-sage-600 underline decoration-gold-300 decoration-1 underline-offset-4"
        >
          Voltar para o convite
        </Link>
      </motion.div>
    </main>
  );
}
