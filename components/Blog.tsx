import React from 'react';
import { POSTS } from '../constants';
import { SectionId } from '../types';
import { Icons } from './Icons';

export const Blog: React.FC = () => {
  return (
    <section id={SectionId.BLOG} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-textMain mb-12 flex items-center gap-2">
          <Icons.BookOpen className="text-primary" /> 近期文章
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {POSTS.map((post) => {
            const href = post.link || '#';
            return (
              <a
                key={post.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-transparent border-t border-border pt-8 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3 text-xs font-medium text-textMuted mb-3">
                  <span>{post.date}</span>
                </div>

                <h3 className="text-xl font-bold text-textMain mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <div className="mt-auto flex items-center text-sm font-medium text-textMain group-hover:translate-x-1 transition-transform">
                  查看文档 <Icons.ArrowRight size={14} className="ml-1" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};