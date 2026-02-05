import React from 'react';
import { PROFILE, LINKS } from '../constants';
import { Icons } from './Icons';
import { SectionId } from '../types';

export const Hero: React.FC = () => {
  return (
    <section id={SectionId.HOME} className="pt-24 pb-20 px-6 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="bg-surface border border-border rounded-3xl p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-textMain mb-4">{PROFILE.name}</h1>
          <p className="text-lg text-textMuted mb-4">{PROFILE.role} · {PROFILE.location}</p>
          <p className="text-base text-textMuted leading-relaxed mb-6">{PROFILE.bio}</p>

          <div className="flex justify-center gap-3 mb-4">
            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-border bg-card text-textMain font-semibold"
            >
              查看简历
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="px-4 py-2 rounded-full border border-border bg-card text-textMain font-semibold"
            >
              联系我
            </a>
          </div>

          <div className="flex justify-center gap-3 mt-2">
            {LINKS.map((link) => {
              const Icon = Icons[link.iconName as keyof typeof Icons] || Icons.ExternalLink;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-surfaceHighlight border border-border rounded-full text-textMuted hover:text-textMain transition-colors"
                  aria-label={link.platform}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};