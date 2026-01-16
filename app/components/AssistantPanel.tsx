
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Bot, Loader2, RefreshCw, Check, X, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { analyzeMetrics } from '../services/geminiService';
import { BiometricData, Message, Task } from '../types';

const AssistantPanel: React.FC<{ currentBiometrics: BiometricData | undefined }> = ({ currentBiometrics }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "OTC tactical core initialized. Biometric link verified. Input command.", timestamp: new Date() }
  ]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const updateTasksFromResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    const newTasks: Task[] = [];
    if (lowerText.includes('breathe') || lowerText.includes('reset')) {
      newTasks.push({ 
        id: 't-' + Date.now(), title: 'Respiration Cycle Beta', priority: 'high', 
        status: 'recommended', category: 'Focus', cognitiveLoad: 2,
        subTasks: [{ id: 'st1', title: 'Box Breathing (5-5-5)', completed: false }]
      });
    }
    if (newTasks.length > 0) setTasks(prev => [...newTasks, ...prev].slice(0, 2));
  };

  const handleSend = async (e?: React.FormEvent, customInput?: string, audioBase64?: string) => {
    e?.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() && !audioBase64) return;
    if (isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: audioBase64 ? "VOICE_CMD_EXEC" : finalInput, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);
    const response = await analyzeMetrics(currentBiometrics, finalInput, audioBase64);
    setMessages(prev => [...prev, { role: 'assistant', text: response || "RETRY: Connection lag.", timestamp: new Date() }]);
    updateTasksFromResponse(response || '');
    setIsTyping(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          handleSend(undefined, "VOICE_SIGNAL", base64Audio);
        };
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-3xl bg-orb-accent/20 flex items-center justify-center text-orb-accent border border-orb-accent/30 animate-pulse">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest-extra text-white">AI.OPERATIVE</h3>
              <p className="text-[8px] text-orb-muted font-bold uppercase tracking-[0.2em]">Operational Intelligence</p>
            </div>
          </div>
          <button className="p-2 text-orb-muted hover:text-orb-accent transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {tasks.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] text-orb-accent font-black uppercase tracking-widest flex items-center gap-2">
              <BrainCircuit size={12} /> Directives
            </p>
            {tasks.map(task => (
              <div key={task.id} className="glass border-orb-accent/20 p-5 rounded-[2rem]">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-white">{task.title}</span>
                  <button onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                    {expandedTask === task.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-[2rem] text-xs leading-relaxed ${msg.role === 'user' ? 'bg-orb-accent/10 border border-orb-accent/20 text-white' : 'bg-orb-main/40 border border-white/5 text-orb-muted'}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isTyping && <Loader2 size={16} className="animate-spin text-orb-accent mx-auto" />}
      </div>

      <div className="p-8 bg-white/5 backdrop-blur-md border-t border-white/5">
        <form onSubmit={handleSend} className="flex items-center gap-4">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Command operative..." 
            className="flex-1 bg-orb-deep/60 border border-white/10 rounded-2xl py-4 px-6 text-xs focus:outline-none focus:border-orb-accent/50 transition-all text-white placeholder:text-orb-muted"
          />
          <button 
            type="button" onMouseDown={startRecording} onMouseUp={() => setIsRecording(false)}
            className={`p-4 rounded-2xl transition-all ${isRecording ? 'bg-red-500 text-white' : 'bg-orb-card text-orb-muted'}`}
          >
            <Mic size={18} />
          </button>
          <button type="submit" className="p-4 bg-orb-accent text-orb-deep rounded-2xl shadow-lg shadow-orb-accent/20">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssistantPanel;
