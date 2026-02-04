import React from 'react';
import { PROFILE, LINKS } from '../constants';
import { Icons } from './Icons';
import { SectionId } from '../types';

export const Hero: React.FC = () => {
  return (
    <section id={SectionId.HOME} className="pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Intro Card */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-3xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              正在准备实习
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-textMain mb-6">
              构建有价值的 <br/>
              <span className="text-textMuted">数字体验。</span>
            </h1>
            
            <p className="text-lg text-textMuted max-w-2xl leading-relaxed mb-8">
              {PROFILE.bio}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById(SectionId.PROJECTS)?.scrollIntoView({behavior:'smooth'})}
                className="bg-textMain text-background px-6 py-3 rounded-full font-semibold hover:bg-surfaceHighlight hover:text-textMain border border-transparent hover:border-border transition-all flex items-center gap-2"
              >
                查看项目 <Icons.ArrowRight size={18} />
              </button>
              <div className="flex gap-2">
                {LINKS.map((link) => {
                  const Icon = Icons[link.iconName as keyof typeof Icons] || Icons.ExternalLink;
                  return (
                    <a 
                      key={link.platform} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-surfaceHighlight border border-border rounded-full text-textMuted hover:text-textMain hover:border-primary/50 transition-all"
                      aria-label={link.platform}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats / Info Cards (Bento Grid) */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-surfaceHighlight border border-border rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
             <Icons.Code2 className="absolute top-4 right-4 text-border opacity-20" size={64} />
             <h3 className="text-3xl font-bold text-textMain mb-2"></h3>
             <p className="text-textMuted"></p>
          </div>
          <div className="bg-surfaceHighlight border border-border rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
             <Icons.BookOpen className="absolute top-4 right-4 text-border opacity-20" size={64} />
             <h3 className="text-3xl font-bold text-textMain mb-2"></h3>
             <p className="text-textMuted"></p>
          </div>
        </div>
      </div>
    </section>
  );
};