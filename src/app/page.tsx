'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  HeartHandshake,
  Camera,
  Gift,
  Home
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IconButton } from '@/components/IconButton';
import { ElegantDivider } from '@/components/ElegantDivider';
import { weddingConfig } from '@/config/wedding';

const iconItems = [
  {
    label: 'Local cerimônia',
    href: weddingConfig.ceremony.maps,
    icon: <MapPin size={22} />,
    external: true
  },
  {
    label: 'Confirmar presença',
    href: '/rsvp',
    icon: <HeartHandshake size={22} />
  },
  {
    label: 'Site dos noivos',
    href: '/noivos',
    icon: <Camera size={22} />
  },
  {
    label: 'Lista de presentes',
    href: '/presentes',
    icon: <Gift size={22} />
  },
  {
    label: 'Local recepção',
    href: weddingConfig.reception.maps,
    icon: <Home size={22} />,
    external: true
  }
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12">
      <Image
        src="/floral.svg"
        alt="Ornamento floral"
        width={180}
        height={180}
        className="flower-corner flower-top-left"
      />
      <Image
        src="/floral.svg"
        alt="Ornamento floral"
        width={180}
        height={180}
        className="flower-corner flower-top-right"
      />
      <Image
        src="/floral.svg"
        alt="Ornamento floral"
        width={180}
        height={180}
        className="flower-corner flower-bottom-left"
      />
      <Image
        src="/floral.svg"
        alt="Ornamento floral"
        width={180}
        height={180}
        className="flower-corner flower-bottom-right"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-sage-500">
          {weddingConfig.heroMessage}
        </p>
        <h1 className="font-display text-4xl tracking-wide text-sage-600 sm:text-5xl">
          {weddingConfig.couple}
        </h1>
        <div className="text-sm uppercase tracking-[0.4em] text-gold-300">
          {weddingConfig.surname}
        </div>

        <ElegantDivider />

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] text-warm-600">
          <span>{weddingConfig.date.weekday}</span>
          <span className="text-gold-300">|</span>
          <span>{weddingConfig.date.month}</span>
          <span className="text-gold-300">|</span>
          <span className="text-lg font-semibold text-sage-600">
            {weddingConfig.date.day}
          </span>
          <span className="text-gold-300">|</span>
          <span>{weddingConfig.date.time}</span>
          <span className="text-gold-300">|</span>
          <span>{weddingConfig.date.year}</span>
        </div>

        <p className="max-w-xl text-lg text-warm-600">
          {weddingConfig.gratitude}
        </p>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {iconItems.map((item) => (
            <IconButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              external={item.external}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm text-warm-600">
          <p>{weddingConfig.city}</p>
          <Link
            className="text-sage-600 underline decoration-gold-300 decoration-1 underline-offset-4"
            href="/rsvp"
          >
            Confirmar presença até {weddingConfig.rsvpDeadlineDisplay}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
