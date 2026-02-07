'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SectionCard } from '@/components/SectionCard';
import { weddingConfig } from '@/config/wedding';

export default function GiftsPage() {
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
            Lista de presentes
          </p>
          <h1 className="mt-3 font-display text-3xl text-sage-600">
            Presentear é compartilhar amor
          </h1>
        </header>

        <SectionCard>
          <p>
            Fique à vontade para escolher um dos links abaixo ou contribuir via Pix.
            O mais importante é ter você com a gente!
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {weddingConfig.giftLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-sage-100 px-4 py-3 text-center text-sm font-medium text-sage-600 shadow-soft"
              >
                {link.label}
              </a>
            ))}
          </div>
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
