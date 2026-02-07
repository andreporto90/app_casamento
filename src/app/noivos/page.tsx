'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { SectionCard } from '@/components/SectionCard';
import { weddingConfig } from '@/config/wedding';

export default function CouplePage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-4xl flex-col gap-8"
      >
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sage-500">
            Nossa História
          </p>
          <h1 className="mt-3 font-display text-3xl text-sage-600">
            {weddingConfig.couple}
          </h1>
        </header>

        <SectionCard>
          <p>
            André e Julia se conheceram ainda na faculdade e, desde então, descobriram
            uma parceria leve e cheia de significado. Agora, escolhem celebrar esse amor
            ao lado das pessoas que mais amam.
          </p>
          <p>
            Este Wedding App foi pensado para reunir as informações do grande dia e
            tornar tudo simples para você.
          </p>
        </SectionCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {weddingConfig.photos.map((photo, index) => (
            <div key={photo} className="overflow-hidden rounded-3xl">
              <Image
                src={photo}
                alt={`Momentos dos noivos ${index + 1}`}
                width={600}
                height={600}
                className="h-56 w-full object-cover"
              />
            </div>
          ))}
        </div>

        <SectionCard title="Sobre o grande dia">
          <p>
            Cerimônia às {weddingConfig.date.time} seguida de recepção no
            {` ${weddingConfig.reception.name}`}. Prepare-se para uma noite especial!
          </p>
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
