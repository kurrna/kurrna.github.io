import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { PROFILE } from '../constants';
import { Icons } from './Icons';

export const NavBar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = Object.values(SectionId);
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Initialize theme based on HTML class
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: SectionId.HOME, label: '首页' },
    { id: SectionId.PROJECTS, label: '项目' },
    { id: SectionId.RESUME, label: '简历' },
    { id: SectionId.BLOG, label: '博客' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => scrollTo(SectionId.HOME)}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Icons.Code2 size={20} />
          </div>
          <span className="text-textMain">{PROFILE.name}</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === item.id ? 'text-primary' : 'text-textMuted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-textMuted hover:text-textMain hover:bg-surfaceHighlight transition-all"
            aria-label="Toggle Theme"
          >
            {isDark ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          <button onClick={() => scrollTo(SectionId.PROJECTS)} className="text-primary font-medium text-sm">
            菜单
          </button>
        </div>
      </div>
    </nav>
  );
};