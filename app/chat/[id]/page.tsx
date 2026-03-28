'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Bot as BotType } from '@/lib/db';
import { Send, Mic, Square, ArrowLeft, Loader2, Bot as BotIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'model'; text: string; timestamp: Date; reaction?: string };

const colorMap: Record<string, { bg: string, text: string, border: string, from: string, to: string, ring: string, lightBg: string, hoverBg: string, hoverFrom: string, hoverTo: string }> = {
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-500', from: 'from-indigo-600', to: 'to-purple-600', ring: 'focus:ring-indigo-500', lightBg: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-50', hoverFrom: 'hover:from-indigo-700', hoverTo: 'hover:to-purple-700' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-500', from: 'from-emerald-600', to: 'to-teal-600', ring: 'focus:ring-emerald-500', lightBg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-50', hoverFrom: 'hover:from-emerald-700', hoverTo: 'hover:to-teal-700' },
  rose: { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-500', from: 'from-rose-600', to: 'to-pink-600', ring: 'focus:ring-rose-500', lightBg: 'bg-rose-50', hoverBg: 'hover:bg-rose-50', hoverFrom: 'hover:from-rose-700', hoverTo: 'hover:to-pink-700' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-500', from: 'from-amber-600', to: 'to-orange-600', ring: 'focus:ring-amber-500', lightBg: 'bg-amber-50', hoverBg: 'hover:bg-amber-50', hoverFrom: 'hover:from-amber-700', hoverTo: 'hover:to-orange-700' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-500', from: 'from-purple-600', to: 'to-fuchsia-600', ring: 'focus:ring-purple-500', lightBg: 'bg-purple-50', hoverBg: 'hover:bg-purple-50', hoverFrom: 'hover:from-purple-700', hoverTo: 'hover:to-fuchsia-700' },
  sky: { bg: 'bg-sky-600', text: 'text-sky-600', border: 'border-sky-500', from: 'from-sky-600', to: 'to-blue-600', ring: 'focus:ring-sky-500', lightBg: 'bg-sky-50', hoverBg: 'hover:bg-sky-50', hoverFrom: 'hover:from-sky-700', hoverTo: 'hover:to-blue-700' },
};

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'voice' ? 'voice' : 'text';
  const botId = params.id as string;

  const [bot, setBot] = useState<BotType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>(initialMode);
  
  // Voice state
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load bot data and chat history
  useEffect(() => {
    fetch(`/api/bots/${botId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch bot');
        return res.json();
      })
      .then((data) => {
        setBot(data);
        
        // Load chat history from local storage
        const savedHistory = localStorage.getItem(`chat_history_${botId}`);
        if (savedHistory) {
          try {
            const parsedHistory = JSON.parse(savedHistory);
            // Convert string timestamps back to Date objects
            const formattedHistory = parsedHistory.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(formattedHistory);
          } catch (e) {
            console.error('Failed to parse chat history', e);
          }
        }
        
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'Failed to fetch' || err.message?.includes('fetch failed')) {
          alert('Network error. Please check your connection or ensure the API is reachable.');
        } else {
          console.error(err);
        }
        setLoading(false);
      });
  }, [botId]);

  // Save chat history to local storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${botId}`, JSON.stringify(messages));
    }
  }, [messages, botId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generating]);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear this chat history?')) {
      setMessages([]);
      localStorage.removeItem(`chat_history_${botId}`);
    }
  };

  const handleReaction = (index: number, emoji: string) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[index] = { ...newMessages[index], reaction: newMessages[index].reaction === emoji ? undefined : emoji };
      return newMessages;
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !bot) return;

    const userMessage = input.trim();
    
    // Basic AI Safety / Abuse Word Filter
    const blockedWords = ['abuse', 'illegal', 'spam', 'hate', 'violence'];
    if (blockedWords.some(word => userMessage.toLowerCase().includes(word))) {
      alert('Your message contains blocked content and violates our safety guidelines.');
      return;
    }

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage, timestamp: new Date() }]);
    setGenerating(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.text }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId: bot.id, message: userMessage, history }),
      });

      if (!response.ok) throw new Error('Failed to fetch chat response');
      if (!response.body) throw new Error('No response body');

      setMessages((prev) => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });
      }
      
      // If in voice mode, play the response
      if (mode === 'voice' && fullResponse) {
        playTTS(fullResponse);
      }

      // Smart Upsell AI
      if (messages.length > 0 && (messages.length + 2) % 6 === 0) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'model', text: '🌟 Enjoying the chat? Upgrade to Premium to unlock video responses, voice cloning, and deep memory features!', timestamp: new Date() }]);
        }, 3000);
      }

    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.message?.includes('fetch failed')) {
        setMessages((prev) => [...prev, { role: 'model', text: 'Network error. Please check your connection.', timestamp: new Date() }]);
      } else {
        console.error('Error generating response:', error);
        setMessages((prev) => [...prev, { role: 'model', text: error.message || 'Sorry, I encountered an error generating a response.', timestamp: new Date() }]);
      }
    } finally {
      setGenerating(false);
    }
  };

  const playTTS = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS failed');

      if (!response.body) return;

      if ("MediaSource" in window && MediaSource.isTypeSupported("audio/mpeg")) {
        const audio = new Audio();
        const mediaSource = new MediaSource();
        audio.src = URL.createObjectURL(mediaSource);
        
        mediaSource.addEventListener("sourceopen", async () => {
            const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
            const reader = response.body!.getReader();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    mediaSource.endOfStream();
                    break;
                }
                
                await new Promise<void>(resolve => {
                    if (sourceBuffer.updating) {
                        sourceBuffer.addEventListener("updateend", () => resolve(), { once: true });
                    } else {
                        resolve();
                    }
                });
                
                sourceBuffer.appendBuffer(value);
            }
        });
        
        audio.play();
      } else {
        const chunks = [];
        const reader = response.body.getReader();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }
        
        const blob = new Blob(chunks, { type: "audio/mpeg" });
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
      }
    } catch (error: any) {
      if (!error.message?.toLowerCase().includes('fetch failed') && !error.message?.includes('Failed to fetch')) {
        console.error('Error playing TTS:', error);
      } else {
        alert('Network error. Please check your connection.');
      }
    }
  };

  const handleVoiceToggle = async () => {
    if (!bot) return;
    
    if (isRecording) {
      setIsRecording(false);
      // For MVP, we'll simulate voice input by sending a predefined message or using SpeechRecognition
      // Let's try to use SpeechRecognition if available, otherwise fallback
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // We actually should start recognition when isRecording becomes true.
        // Let's refactor this slightly.
      } else {
        // Fallback simulation
        setInput("Tell me about your expertise.");
        handleSend();
      }
      
    } else {
      setIsRecording(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; // Or hi-IN
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
          // We can't directly call handleSend here easily because state updates are async,
          // but we can trigger it in a useEffect or directly pass the text.
          // Let's just set the input and let the user press send, or auto-send.
          setTimeout(() => {
             const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
             // We need to pass the transcript directly to avoid state closure issues
             sendDirectMessage(transcript);
          }, 100);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } else {
        // Fallback if no speech recognition
        setTimeout(() => {
          setIsRecording(false);
          sendDirectMessage("Hello, tell me about your background.");
        }, 2000);
      }
    }
  };

  const sendDirectMessage = async (userMessage: string) => {
    if (!bot) return;
    setMessages((prev) => [...prev, { role: 'user', text: userMessage, timestamp: new Date() }]);
    setGenerating(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.text }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId: bot.id, message: userMessage, history }),
      });

      if (!response.ok) throw new Error('Failed to fetch chat response');
      if (!response.body) throw new Error('No response body');

      setMessages((prev) => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });
      }
      
      if (mode === 'voice' && fullResponse) {
        playTTS(fullResponse);
      }

      // Smart Upsell AI
      if (messages.length > 0 && (messages.length + 2) % 6 === 0) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'model', text: '🌟 Enjoying the chat? Upgrade to Premium to unlock video responses, voice cloning, and deep memory features!', timestamp: new Date() }]);
        }, 3000);
      }

    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.message?.includes('fetch failed')) {
        setMessages((prev) => [...prev, { role: 'model', text: 'Network error. Please check your connection.', timestamp: new Date() }]);
      } else {
        console.error('Error generating response:', error);
        setMessages((prev) => [...prev, { role: 'model', text: error.message || 'Sorry, I encountered an error generating a response.', timestamp: new Date() }]);
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!bot) {
    return <div className="p-12 text-center text-slate-500 bg-slate-50 min-h-[calc(100vh-4rem)]">Bot not found.</div>;
  }

  const theme = colorMap[bot.colorScheme || 'indigo'] || colorMap.indigo;

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] max-w-5xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl sm:rounded-3xl sm:my-8 border-x-0 sm:border border-white/20 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${theme.lightBg} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`}></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-white/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="relative shrink-0">
            <img src={bot.avatarUrl} alt={bot.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">{bot.name}</h2>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{bot.expertise.join(' • ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <div className="flex bg-slate-100/80 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setMode('text')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${mode === 'text' ? `bg-white shadow-sm ${theme.text}` : 'text-slate-500 hover:text-slate-700'}`}
            >
              Text
            </button>
            <button
              onClick={() => setMode('voice')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${mode === 'voice' ? `bg-white shadow-sm ${theme.text}` : 'text-slate-500 hover:text-slate-700'}`}
            >
              Voice
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      {mode === 'text' ? (
        <div className="flex flex-col flex-1 overflow-hidden z-10">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-12 animate-in fade-in zoom-in duration-500">
                <div className="relative mb-4 sm:mb-6">
                  <div className={`absolute inset-0 ${theme.lightBg} rounded-full blur-xl opacity-50`}></div>
                  <div className={`relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-white ${theme.to} border border-white shadow-lg opacity-90`}>
                    <BotIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${theme.text}`} />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Start chatting with {bot.name}</h3>
                <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto px-4">Ask a question based on their expertise, or just say hello to get started.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`relative group max-w-[90%] sm:max-w-[75%] rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-6 sm:py-4 shadow-sm text-sm sm:text-base ${
                  msg.role === 'user' 
                    ? `bg-gradient-to-br ${theme.from} ${theme.to} text-white rounded-tr-sm` 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="prose prose-sm sm:prose-base max-w-none prose-slate prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                  
                  {/* Reaction Button (Hover) */}
                  {msg.role === 'model' && (
                    <div className="absolute -bottom-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white border border-slate-200 shadow-md rounded-full px-2 py-1 z-10">
                      {['❤️', '🔥', '😂', '👍'].map(emoji => (
                        <button 
                          key={emoji} 
                          onClick={() => handleReaction(i, emoji)}
                          className="hover:scale-125 transition-transform text-sm"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Active Reaction */}
                  {msg.reaction && (
                    <div className={`absolute -bottom-3 ${msg.role === 'user' ? '-left-2' : '-right-2'} bg-white border border-slate-200 shadow-sm rounded-full px-2 py-0.5 text-xs z-10`}>
                      {msg.reaction}
                    </div>
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-1.5 sm:mt-2 px-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {generating && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl rounded-tl-sm px-4 py-3 sm:px-6 sm:py-5 shadow-sm flex items-center gap-1.5 sm:gap-2">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${theme.bg} opacity-60 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${theme.bg} opacity-60 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${theme.bg} opacity-60 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-6 bg-white/50 backdrop-blur-md border-t border-slate-100">
            <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${bot.name}...`}
                  className={`w-full rounded-full border-slate-200 bg-white/80 shadow-sm px-4 py-3 sm:px-6 sm:py-4 pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 ${theme.ring} focus:border-transparent transition-all hover:bg-white`}
                  disabled={generating}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || generating}
                className={`shrink-0 inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${theme.from} ${theme.to} text-white ${theme.hoverFrom} ${theme.hoverTo} disabled:opacity-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 sm:ml-1" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Voice Mode UI */
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-white relative overflow-hidden z-10 rounded-b-3xl">
          {/* Atmospheric background */}
          <div className="absolute inset-0 opacity-40">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${theme.from} ${theme.to} blur-[120px] transition-all duration-1000 ${isRecording ? 'scale-150 opacity-60' : 'scale-100 opacity-30'}`} />
          </div>
          
          <div className="z-10 text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className={`absolute inset-0 ${theme.bg} rounded-full blur-2xl transition-all duration-500 ${isRecording ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`}></div>
              <img src={bot.avatarUrl} alt={bot.name} className="relative w-40 h-40 rounded-full object-cover border-4 border-white/20 shadow-2xl" />
            </div>
            <h2 className="text-4xl font-light tracking-tight">{bot.name}</h2>
            <p className={`mt-4 font-mono text-sm uppercase tracking-widest bg-white/5 inline-block px-4 py-1.5 rounded-full border border-white/10 ${theme.text}`}>
              {isRecording ? 'Listening...' : generating ? 'Thinking...' : 'Tap to speak'}
            </p>
          </div>

          <button
            onClick={handleVoiceToggle}
            disabled={generating}
            className={`z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/50' 
                : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20'
            } ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? <Square className="w-10 h-10 fill-current" /> : <Mic className="w-12 h-12" />}
          </button>
          
          {/* Simulated waveform when recording */}
          {isRecording && (
            <div className="absolute bottom-24 flex gap-1.5 items-end h-20 z-10">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 ${theme.bg} opacity-80 rounded-full animate-pulse`}
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 0.4 + 0.4}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
