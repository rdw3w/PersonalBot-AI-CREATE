'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { Bot } from '@/lib/db';
import { ArrowRight, Bot as BotIcon, Zap, Shield, Sparkles, Star, Users, MessageSquare, CheckCircle, Play, ChevronRight, Github, Twitter, Linkedin } from 'lucide-react';
import ThreeBackground from './ThreeBackground';

export default function LandingPage({ initialBots }: { initialBots: Bot[] }) {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const fullText = "of the Future";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#7F00FF]/30 selection:text-white overflow-hidden font-sans">
      {/* Custom Cursor Glow */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-white mix-blend-difference pointer-events-none z-[100] hidden md:block"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-r from-[#7F00FF]/30 to-[#00E5FF]/30 blur-[80px] pointer-events-none z-0 hidden md:block"
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7F00FF] via-[#00E5FF] to-[#FF4D9D] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <ThreeBackground />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ 
            x: mousePosition.x * 0.05, 
            y: mousePosition.y * 0.05 
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 100 }}
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#7F00FF] opacity-20 blur-[120px] mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            x: mousePosition.x * -0.05, 
            y: mousePosition.y * -0.05 
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 100 }}
          className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#00E5FF] opacity-20 blur-[120px] mix-blend-screen"
        />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[#FF4D9D] opacity-10 blur-[150px] mix-blend-screen"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7F00FF] to-[#00E5FF] flex items-center justify-center shadow-[0_0_20px_rgba(127,0,255,0.5)]">
              <BotIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Persona<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#FF4D9D]">Bot</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#mentors" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Mentors</Link>
            <Link href="#how-it-works" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">How it Works</Link>
            <Link href="#features" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Features</Link>
            <Link href="#pricing" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block">Log In</Link>
            <Link href="/dashboard/bot/new" className="relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-[#7F00FF] via-[#00E5FF] to-[#FF4D9D] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
              <div className="relative bg-[#0A0A0A] px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 group-hover:bg-opacity-0">
                <span className="text-sm font-bold text-white">Get Started</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6 min-h-screen flex flex-col justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00E5FF] text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(0,229,255,0.15)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Next Generation of Learning</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] relative z-10"
          >
            Explore AI Mentors <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7F00FF] via-[#00E5FF] to-[#FF4D9D] animate-gradient-x inline-block relative">
              {typedText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -right-4 top-0 bottom-0 w-1 bg-[#00E5FF]"
              />
            </span>
          </motion.h1>
          
          {/* Floating Avatar */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-20 right-[10%] hidden lg:block w-48 h-48 rounded-3xl bg-gradient-to-br from-[#7F00FF]/20 to-[#00E5FF]/20 border border-white/10 backdrop-blur-md p-2 shadow-[0_0_50px_rgba(127,0,255,0.3)] z-0"
          >
            <img src="https://picsum.photos/seed/ai-avatar-hero/400/400" alt="AI Avatar" className="w-full h-full object-cover rounded-2xl" />
            <div className="absolute -bottom-4 -left-4 bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
              <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-white">Online</span>
            </div>
          </motion.div>
          
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute bottom-20 left-[10%] hidden lg:block w-32 h-32 rounded-full bg-gradient-to-br from-[#FF4D9D]/20 to-[#7F00FF]/20 border border-white/10 backdrop-blur-md p-1 shadow-[0_0_40px_rgba(255,77,157,0.3)] z-0"
          >
            <img src="https://picsum.photos/seed/ai-avatar-hero-2/300/300" alt="AI Avatar 2" className="w-full h-full object-cover rounded-full" />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Connecting learners with AI-powered mentors for personalized growth. Train, interact, and evolve with digital clones of industry experts.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/dashboard/bot/new"
              className="relative group w-full sm:w-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#7F00FF] to-[#00E5FF] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
              <button className="relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#0A0A0A] rounded-full border border-white/10 hover:bg-transparent transition-all">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link
              href="#mentors"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all backdrop-blur-md"
            >
              <Play className="mr-2 w-5 h-5" />
              Explore Mentors
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 border-y border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Success Rate', value: '98%', icon: <Star className="w-5 h-5 text-[#FF4D9D]" /> },
              { label: 'Active Learners', value: '10K+', icon: <Users className="w-5 h-5 text-[#00E5FF]" /> },
              { label: 'Expert Mentors', value: '500+', icon: <BotIcon className="w-5 h-5 text-[#7F00FF]" /> },
              { label: 'Daily Chats', value: '25K+', icon: <MessageSquare className="w-5 h-5 text-white" /> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="mb-4 p-3 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white/50 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Cards UI */}
      <section id="mentors" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet Your AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7F00FF]">Mentors</span></h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Interact with highly personalized AI clones of industry experts, ready to guide you 24/7.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialBots.slice(0, 3).map((bot, i) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-[#0A0A0A] rounded-3xl border border-white/10 p-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#7F00FF]/10 to-[#00E5FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <img src={bot.avatarUrl || `https://picsum.photos/seed/${bot.id}/200/200`} alt={bot.name} className="w-20 h-20 rounded-2xl object-cover border border-white/20 group-hover:border-[#00E5FF]/50 transition-colors" />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#0A0A0A] rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#00E5FF] rounded-full animate-pulse shadow-[0_0_10px_#00E5FF]"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      <Star className="w-3 h-3 text-[#FF4D9D] fill-[#FF4D9D]" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{bot.name}</h3>
                  <p className="text-sm text-[#00E5FF] font-medium mb-4">{bot.expertise?.[0] || 'Expert Mentor'}</p>
                  <p className="text-white/60 text-sm line-clamp-2 mb-8">{bot.bio}</p>
                  
                  <Link href={`/chat/${bot.id}`} className="block w-full">
                    <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-[#7F00FF]/50 hover:shadow-[0_0_20px_rgba(127,0,255,0.2)] transition-all duration-300 flex items-center justify-center gap-2">
                      Talk Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
             <Link href="/dashboard" className="inline-flex items-center text-[#00E5FF] hover:text-white transition-colors font-medium">
                View all mentors <ArrowRight className="ml-2 w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-32 bg-black/40 border-y border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D9D] to-[#7F00FF]">Works</span></h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Start learning with your personalized AI mentor in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>

            {[
              { step: '01', title: 'Choose a Mentor', desc: 'Browse our curated list of AI clones based on real industry experts.', icon: <Users className="w-6 h-6 text-[#00E5FF]" /> },
              { step: '02', title: 'Start Chatting', desc: 'Engage in real-time text or voice conversations to learn and grow.', icon: <MessageSquare className="w-6 h-6 text-[#7F00FF]" /> },
              { step: '03', title: 'Achieve Goals', desc: 'Get personalized feedback, roadmaps, and insights to reach your potential.', icon: <CheckCircle className="w-6 h-6 text-[#FF4D9D]" /> },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-[#0A0A0A] border-2 border-white/10 flex items-center justify-center mb-6 group-hover:border-[#00E5FF] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-500 relative">
                  <div className="absolute inset-2 rounded-full bg-white/5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-[#7F00FF] to-[#00E5FF] flex items-center justify-center text-xs font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7F00FF] to-[#FF4D9D]">Features</span></h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Everything you need to accelerate your learning journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Custom Knowledge', desc: 'Mentors are trained on proprietary data and specific expertise.', icon: <BotIcon className="w-6 h-6 text-[#00E5FF]" /> },
              { title: 'Instant Responses', desc: 'Powered by advanced LLMs for zero-latency communication.', icon: <Zap className="w-6 h-6 text-[#FF4D9D]" /> },
              { title: 'Secure & Private', desc: 'End-to-end encryption ensures your conversations stay private.', icon: <Shield className="w-6 h-6 text-[#7F00FF]" /> },
              { title: 'Voice Mode', desc: 'Talk naturally with mentors using advanced TTS and STT.', icon: <MessageSquare className="w-6 h-6 text-white" /> },
              { title: 'Progress Tracking', desc: 'Monitor your learning journey with detailed analytics.', icon: <Star className="w-6 h-6 text-[#00E5FF]" /> },
              { title: '24/7 Availability', desc: 'Learn at your own pace, anytime, anywhere in the world.', icon: <Users className="w-6 h-6 text-[#FF4D9D]" /> },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Endless <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7F00FF] to-[#00E5FF]">Possibilities</span></h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Discover how PersonaBot can transform your learning and career.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Career Coaching', desc: 'Get advice on interviews, resumes, and career paths from top executives.', icon: <Users className="w-8 h-8 text-[#00E5FF]" /> },
              { title: 'Skill Acquisition', desc: 'Learn coding, design, or marketing from AI clones of industry leaders.', icon: <Zap className="w-8 h-8 text-[#FF4D9D]" /> },
              { title: 'Language Practice', desc: 'Converse with native-speaking AI personas to improve fluency.', icon: <MessageSquare className="w-8 h-8 text-[#7F00FF]" /> },
              { title: 'Startup Mentorship', desc: 'Pitch ideas and get feedback from AI clones of successful founders.', icon: <Star className="w-8 h-8 text-white" /> },
            ].map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ rotateY: 10, scale: 1.05 }}
                className="group p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-[#00E5FF]/50 transition-all duration-300"
                style={{ perspective: 1000 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7F00FF]/20 to-[#00E5FF]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing UI */}
      <section id="pricing" className="relative z-10 py-32 bg-black/40 border-y border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#FF4D9D]">Pricing</span></h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Choose the plan that fits your learning goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-xl font-medium text-white/70 mb-2">Basic</h3>
              <div className="text-4xl font-bold text-white mb-6">Free</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white/70"><CheckCircle className="w-5 h-5 text-[#00E5FF]" /> 5 Chats per day</li>
                <li className="flex items-center gap-3 text-white/70"><CheckCircle className="w-5 h-5 text-[#00E5FF]" /> Access to public mentors</li>
                <li className="flex items-center gap-3 text-white/70"><CheckCircle className="w-5 h-5 text-[#00E5FF]" /> Standard response time</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">Get Started</button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl bg-gradient-to-b from-[#7F00FF]/20 to-[#0A0A0A] border border-[#7F00FF]/50 shadow-[0_0_50px_rgba(127,0,255,0.15)] transform md:-translate-y-4"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#7F00FF] to-[#00E5FF] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-medium text-[#00E5FF] mb-2">Pro</h3>
              <div className="text-4xl font-bold text-white mb-2">$29<span className="text-lg text-white/50 font-normal">/mo</span></div>
              <p className="text-sm text-white/60 mb-6">Unlock full potential</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-[#7F00FF]" /> Unlimited Chats</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-[#7F00FF]" /> Access to premium mentors</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-[#7F00FF]" /> Voice mode enabled</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle className="w-5 h-5 text-[#7F00FF]" /> Priority response time</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7F00FF] to-[#00E5FF] text-white font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">Upgrade to Pro</button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-xl font-medium text-white/70 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white/70"><CheckCircle className="w-5 h-5 text-[#FF4D9D]" /> Custom AI models</li>
                <li className="flex items-center gap-3 text-white/70"><CheckCircle className="w-5 h-5 text-[#FF4D9D]" /> Dedicated support</li>
                <li className="flex items-center gap-3 text-white/70"><CheckCircle className="w-5 h-5 text-[#FF4D9D]" /> API access</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">Contact Sales</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0A0A0A] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7F00FF] to-[#00E5FF] flex items-center justify-center">
                  <BotIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">Persona<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#FF4D9D]">Bot</span></span>
              </div>
              <p className="text-white/50 max-w-sm leading-relaxed mb-8">
                The premier platform for AI-powered mentorship. Learn, grow, and evolve with digital clones of the world's best minds.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"><Github className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/50 hover:text-[#00E5FF] transition-colors relative group">Explore Mentors<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00E5FF] group-hover:w-full transition-all duration-300"></span></a></li>
                <li><a href="#" className="text-white/50 hover:text-[#00E5FF] transition-colors relative group">Pricing<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00E5FF] group-hover:w-full transition-all duration-300"></span></a></li>
                <li><a href="#" className="text-white/50 hover:text-[#00E5FF] transition-colors relative group">Use Cases<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00E5FF] group-hover:w-full transition-all duration-300"></span></a></li>
                <li><a href="/admin" className="text-white/50 hover:text-[#FF4D9D] transition-colors relative group">Admin Portal<span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FF4D9D] group-hover:w-full transition-all duration-300"></span></a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/50 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            <p>&copy; {new Date().getFullYear()} PersonaBot AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Floating Chatbot Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[#7F00FF] to-[#00E5FF] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)] border border-white/20 group"
      >
        <MessageSquare className="w-7 h-7 text-white group-hover:animate-bounce" />
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-[#FF4D9D] rounded-full border-2 border-[#0A0A0A]"></span>
      </motion.button>
    </div>
  );
}
