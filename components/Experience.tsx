import React from 'react';
import { EXPERIENCE, SKILLS } from '../constants';
import { SectionId } from '../types';
import { Icons } from './Icons';

export const Experience: React.FC = () => {
  return (
    <section id={SectionId.RESUME} className="py-20 px-6 bg-surfaceHighlight/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Experience Column */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-bold text-textMain mb-8 flex items-center gap-2">
            <Icons.Briefcase className="text-primary" /> 工作经历
          </h2>
          
          <div className="space-y-8">
            {EXPERIENCE.map((job, index) => (
              <div key={job.id} className="relative pl-8 border-l border-border last:border-0 pb-8 last:pb-0">
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-bold text-textMain">{job.role}</h3>
                  <span className="text-sm font-medium text-textMuted bg-surface border border-border px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                    {job.period}
                  </span>
                </div>
                
                <div className="text-lg text-primary/80 font-medium mb-4">{job.company}</div>
                <p className="text-textMuted leading-relaxed mb-4">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="text-xs text-textMuted px-2 py-1 rounded bg-surface border border-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Column */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <h2 className="text-3xl font-bold text-textMain mb-8 flex items-center gap-2">
              <Icons.Code2 className="text-primary" /> 技术栈
            </h2>
            
            <div className="bg-surface border border-border rounded-3xl p-8">
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 rounded-lg bg-surfaceHighlight hover:bg-primary/10 hover:text-primary hover:border-primary/50 border border-border text-textMuted text-sm font-medium transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-lg font-semibold text-textMain mb-4">近期学习计划</h4>
                <div className="flex items-center gap-3 text-textMuted text-sm">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span>golang 项目实战</span>
                </div>
                <div className="flex items-center gap-3 text-textMuted text-sm mt-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span>中间件 mysql、redis、kafka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};