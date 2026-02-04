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
              <Icons.Terminal className="text-primary" /> 精选项目
            </h2>
            <p className="text-textMuted max-w-xl">
              开源库、全栈应用程序和技术实验的合集。
            </p>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-textMain hover:text-primary flex items-center gap-1 transition-colors">
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
                  <div className="flex items-center gap-1 text-xs font-medium text-textMuted">
                    <Icons.Star size={14} /> {project.stars}
                  </div>
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
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-surfaceHighlight text-textMuted border border-border/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};