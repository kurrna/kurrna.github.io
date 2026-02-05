import React from 'react';
import { PROFILE } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-border bg-surfaceHighlight/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-textMuted text-sm">
          © {new Date().getFullYear()} {PROFILE.name}. 保留所有权利.
        </div>
        <div className="text-textMuted text-sm flex gap-6">
          <a href={`mailto:${PROFILE.email}`} className="hover:text-textMain transition-colors">联系方式</a>
        </div>
      </div>
    </footer>
  );
};