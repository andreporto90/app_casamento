import Link from 'next/link';
import { ReactNode } from 'react';

type IconButtonProps = {
  icon: ReactNode;
  label: string;
  href: string;
  external?: boolean;
};

export function IconButton({ icon, label, href, external }: IconButtonProps) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group flex flex-col items-center gap-3 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sage-300 bg-white shadow-soft transition-transform duration-300 group-hover:-translate-y-1">
        <span className="text-sage-600">{icon}</span>
      </div>
      <span className="text-sm font-medium text-warm-600">{label}</span>
    </Link>
  );
}
