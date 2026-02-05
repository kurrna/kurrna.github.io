import React from 'react';
import { PROJECTS } from '../constants';
import { SectionId } from '../types';
import { Icons } from './Icons';

export const Projects: React.FC = () => {
  return (
    <section id={SectionId.PROJECTS} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-textMain mb-4 flex items-center gap-2">
              <Icons.Terminal className="text-primary" /> 我的项目
            </h2>
          </div>
          <a href="https://github.com/kurrna" target="_blank" rel="noreferrer" className="text-sm font-medium text-textMain hover:text-primary flex items-center gap-1 transition-colors">
            在 GitHub 上查看全部 <Icons.ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <div 
              key={project.id} 
              className={`group bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col ${project.featured ? 'lg:col-span-2' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surfaceHighlight rounded-lg text-primary">
                  {project.featured ? <Icons.Star size={24} fill="currentColor" className="text-primary" /> : <Icons.Code2 size={24} />}
                </div>
                <div className="flex items-center gap-3">
                  <a href={project.link} target="_blank" rel="noreferrer" className="text-textMuted hover:text-textMain">
                    <Icons.ExternalLink size={18} />
                  </a>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-textMain mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-textMuted mb-6 flex-1 leading-relaxed">
                {project.description}
              </p>
            
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};