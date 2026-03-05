'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { SectionCard } from '@/components/SectionCard';
import { weddingConfig } from '@/config/wedding';
import { hasSupabaseConfig, supabase } from '@/lib/supabaseClient';
import { memoryRsvpStore, type RsvpRecord } from '@/lib/rsvpStore';

const demoRecords: RsvpRecord[] = [
  {
    id: 'demo-1',
    name: 'Camila Silva',
    phone: '11 99999-0000',
    guests_count: 2,
    attending: true,
    dietary: 'Vegetariana',
    message: 'Ansiosa para celebrar!',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    name: 'Pedro Lima',
    phone: '18 98888-0000',
    guests_count: 1,
    attending: false,
    dietary: null,
    message: 'Infelizmente não poderei.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [records, setRecords] = useState<RsvpRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const totals = useMemo(() => {
    const yes = records.filter((record) => record.attending).length;
    const no = records.length - yes;
    return { yes, no, total: records.length };
  }, [records]);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user?.email ?? null);
    });
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setStatus('Configure as variáveis do Supabase para login.');
      return;
    }
    setLoading(true);
    setStatus(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setStatus('Erro no login. Verifique seus dados.');
    } else {
      setSessionEmail(data.user?.email ?? null);
    }
    setLoading(false);
  };

  const fetchRecords = async () => {
    setLoading(true);
    setStatus(null);
    try {
      if (hasSupabaseConfig && supabase) {
        const { data, error } = await supabase.from('rsvps').select('*');
        if (error) {
          throw error;
        }
        setRecords(data as RsvpRecord[]);
      } else {
        const stored = await memoryRsvpStore.list();
        if (stored.length === 0) {
          setRecords(demoRecords);
        } else {
          setRecords(stored);
        }
      }
    } catch (error) {
      setStatus('Erro ao carregar RSVPs.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = [
      'id',
      'name',
      'phone',
      'guests_count',
      'attending',
      'dietary',
      'message',
      'created_at'
    ];
    const rows = records.map((record) =>
      [
        record.id,
        record.name,
        record.phone,
        record.guests_count,
        record.attending ? 'Sim' : 'Não',
        record.dietary ?? '',
        record.message ?? '',
        record.created_at
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rsvps.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredRecords = records.filter((record) => {
    const term = query.toLowerCase();
    return (
      record.name.toLowerCase().includes(term) ||
      record.phone.toLowerCase().includes(term)
    );
  });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seu-dominio.vercel.app';

  return (
    <main className="min-h-screen px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-5xl flex-col gap-8"
      >
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sage-500">
            Painel dos noivos
          </p>
          <h1 className="mt-3 font-display text-3xl text-sage-600">
            Admin
          </h1>
        </header>

        {!sessionEmail && hasSupabaseConfig ? (
          <SectionCard title="Login">
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="space-y-2 text-sm">
                <span>Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-full border border-sage-100 px-4 py-2"
                  type="email"
                  required
                />
              </label>
              <label className="space-y-2 text-sm">
                <span>Senha</span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-full border border-sage-100 px-4 py-2"
                  type="password"
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-sage-500 px-4 py-3 text-sm font-medium text-white"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            {status ? (
              <p className="text-center text-sm text-sage-600">{status}</p>
            ) : null}
          </SectionCard>
        ) : null}

        {!hasSupabaseConfig ? (
          <SectionCard title="Modo demo">
            <p>
              Configure as variáveis do Supabase para autenticação e dados reais. Por
              enquanto, o painel exibe dados mock.
            </p>
          </SectionCard>
        ) : null}

        <SectionCard title="QR Code do convite">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <QRCodeCanvas value={siteUrl} size={140} />
            <div className="text-sm text-warm-600">
              <p>Compartilhe este QR Code no convite físico.</p>
              <p>URL atual: {siteUrl}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="RSVPs">
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-sage-100 p-4 text-center">
                <p className="text-sm text-warm-600">Vou</p>
                <p className="text-2xl font-semibold text-sage-600">{totals.yes}</p>
              </div>
              <div className="rounded-2xl border border-sage-100 p-4 text-center">
                <p className="text-sm text-warm-600">Não vou</p>
                <p className="text-2xl font-semibold text-sage-600">{totals.no}</p>
              </div>
              <div className="rounded-2xl border border-sage-100 p-4 text-center">
                <p className="text-sm text-warm-600">Total</p>
                <p className="text-2xl font-semibold text-sage-600">{totals.total}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome ou telefone"
                className="flex-1 rounded-full border border-sage-100 px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={fetchRecords}
                className="rounded-full bg-sage-500 px-4 py-2 text-sm text-white"
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Atualizar'}
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-full border border-sage-200 px-4 py-2 text-sm text-sage-600"
              >
                Exportar CSV
              </button>
            </div>

            {status ? <p className="text-sm text-sage-600">{status}</p> : null}

            <div className="overflow-hidden rounded-2xl border border-sage-100">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-sage-50 text-xs uppercase text-warm-600">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Convidados</th>
                    <th className="px-4 py-3">Resposta</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-t border-sage-100">
                      <td className="px-4 py-3">{record.name}</td>
                      <td className="px-4 py-3">{record.phone}</td>
                      <td className="px-4 py-3">{record.guests_count}</td>
                      <td className="px-4 py-3">
                        {record.attending ? 'Vou' : 'Não vou'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>
      </motion.div>
    </main>
  );
}
