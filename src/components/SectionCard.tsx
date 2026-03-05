import { ReactNode } from 'react';

type SectionCardProps = {
  title?: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-sage-100 bg-white/80 p-6 shadow-soft backdrop-blur">
      {title ? (
        <h2 className="mb-4 font-display text-2xl text-sage-600">{title}</h2>
      ) : null}
      <div className="space-y-3 text-warm-600">{children}</div>
    </section>
  );
}
