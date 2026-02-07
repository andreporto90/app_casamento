'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionCard } from '@/components/SectionCard';
import { weddingConfig } from '@/config/wedding';

export default function ReceptionPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-3xl flex-col gap-8"
      >
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sage-500">
            Recepção
          </p>
          <h1 className="mt-3 font-display text-3xl text-sage-600">
            {weddingConfig.reception.name}
          </h1>
        </header>

        <SectionCard title="Endereço">
          <p>{weddingConfig.reception.address}</p>
          <Link
            href={weddingConfig.reception.maps}
            target="_blank"
            rel="noreferrer"
            className="text-sage-600 underline decoration-gold-300 decoration-1 underline-offset-4"
          >
            Abrir no Google Maps
          </Link>
        </SectionCard>

        <SectionCard title="Horário">
          <p>Pós-cerimônia, a partir das {weddingConfig.date.time}.</p>
          <p>Recepção com música e jantar especial.</p>
        </SectionCard>

        <SectionCard title="Estacionamento">
          <ul className="list-disc space-y-2 pl-4">
            <li>Estacionamento interno disponível.</li>
            <li>Equipe no local para orientar.</li>
          </ul>
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
