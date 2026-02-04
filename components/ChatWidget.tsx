import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { sendMessageToDeepSeek } from '../services/deepseekService';
import { PROFILE } from '../constants';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `你好！我是 ${PROFILE.name} 的 AI 助手。你可以问我关于他项目或工作经历的任何问题。` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Check for env key on mount (simulated for client-side demo if user provides one)
  useEffect(() => {
    if (process.env.API_KEY) {
      setApiKey(process.env.API_KEY);
      setHasKey(true);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !hasKey) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass history excluding the very last user message we just added locally
      // (The service handles history reconstruction, but here we just pass simple objects for the service to format)
      // Note: In a real app, we'd manage history more robustly.
      const responseText = await sendMessageToDeepSeek(apiKey, userMsg, 
        messages.filter(m => m.role !== 'model' || m.content !== messages[0].content) // Filter out welcome msg if needed, or keep it.
      );

      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', content: responseText }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "抱歉，出错了。请检查您的 API Key 或稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 0) {
      setHasKey(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-surface border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-surfaceHighlight">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-md">
                <Icons.Terminal size={16} className="text-primary" />
              </div>
              <span className="font-semibold text-sm">AI 助手</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-textMain transition-colors">
              <Icons.X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {!hasKey ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-4">
                <Icons.Terminal size={48} className="text-border" />
                <p className="text-sm text-textMuted">如需与 AI 助手聊天，请输入有效的 DeepSeek API Key。</p>
                <form onSubmit={handleKeySubmit} className="w-full space-y-2">
                  <input 
                    type="password" 
                    placeholder="输入 API Key" 
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-white py-2 rounded-md text-sm font-medium transition-colors">
                    开始聊天
                  </button>
                  <p className="text-xs text-textMuted">密钥仅存储在您的浏览器内存中。</p>
                </form>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-surfaceHighlight text-textMain border border-border'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surfaceHighlight border border-border rounded-lg px-4 py-3">
                      <Icons.Loader2 size={16} className="animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          {hasKey && (
            <div className="p-3 border-t border-border bg-surface">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="询问我的技能..."
                  className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                >
                  <Icons.Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-surfaceHighlight text-textMain border border-border' : 'bg-primary hover:bg-primaryHover text-white'
        }`}
      >
        {isOpen ? <Icons.X size={20} /> : <Icons.MessageSquare size={20} />}
        <span className={`font-medium ${isOpen ? 'hidden' : 'block'}`}>咨询 AI</span>
      </button>
    </div>
  );
};