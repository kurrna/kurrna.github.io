import React from 'react';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Blog } from './components/Blog';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <div className="bg-background min-h-screen text-textMain selection:bg-primary/30 selection:text-white">
      <NavBar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Blog />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default App;