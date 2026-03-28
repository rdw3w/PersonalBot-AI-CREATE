import { Bot as BotIcon } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7F00FF] rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7F00FF]/20 to-[#00E5FF]/20 border border-white/10 flex items-center justify-center mb-8 animate-bounce shadow-[0_0_30px_rgba(127,0,255,0.3)]">
          <BotIcon className="w-10 h-10 text-[#00E5FF]" />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#7F00FF] animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 rounded-full bg-[#FF4D9D] animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 animate-pulse">
          Initializing PersonaBot...
        </h2>
      </div>
    </div>
  );
}
