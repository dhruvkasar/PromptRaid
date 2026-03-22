import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Volume2, VolumeX, Zap, Trophy, Swords, Github, Instagram } from 'lucide-react';
import { playCountdown, playFight, playCrash, playFanfare, startBGM, stopBGM } from './audio';
import { judgePrompts, BattleResults } from './ai';
import { AnimatedCounter, ScoreBar } from './components';

type BattleState = 'idle' | 'countdown' | 'battling' | 'results';

const CreatorLink = ({ name, github, instagram }: { name: string, github: string, instagram: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-vivid-yellow px-3 py-1 brutal-border hover:bg-yellow-400 transition-colors uppercase"
      >
        {name}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white brutal-border brutal-shadow flex flex-col gap-3 p-3 z-50 min-w-[140px]"
          >
            <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-hot-red font-sans text-sm font-bold uppercase">
              <Github size={18} /> GitHub
            </a>
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-hot-red font-sans text-sm font-bold uppercase">
              <Instagram size={18} /> Insta
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MorphingTitle = () => {
  const words = ["AI ARENA", "NEURAL CLASH", "PROMPTRAID"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length - 1) {
      const timer = setTimeout(() => {
        setIndex(index + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <div className="relative h-[40px] md:h-[72px] flex items-center overflow-hidden px-2">
      <AnimatePresence mode="wait">
        <motion.h1
          key={index}
          initial={{ y: 40, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -40, opacity: 0, rotateX: 90 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="font-display text-3xl md:text-6xl font-black uppercase tracking-tighter text-stroke-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] whitespace-nowrap origin-center"
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [prompt1, setPrompt1] = useState('');
  const [prompt2, setPrompt2] = useState('');
  const [battleState, setBattleState] = useState<BattleState>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [results, setResults] = useState<BattleResults | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (battleState !== 'idle') startBGM();
    } else {
      setIsMuted(true);
      stopBGM();
    }
  };

  const startBattle = async () => {
    if (!prompt1.trim() || !prompt2.trim()) {
      setError("Both prompts must enter the arena!");
      return;
    }
    setError(null);
    setBattleState('countdown');
    if (!isMuted) startBGM();

    // Countdown sequence
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      if (!isMuted) playCountdown();
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setCountdown(0); // 0 means "FIGHT!"
    if (!isMuted) playFight();
    await new Promise(r => setTimeout(r, 800));
    
    setBattleState('battling');
    
    try {
      const res = await judgePrompts(prompt1, prompt2);
      setResults(res);
      if (!isMuted) playCrash();
      setBattleState('results');
      if (!isMuted) setTimeout(playFanfare, 500);
    } catch (err) {
      console.error(err);
      setError("The AI judge malfunctioned! Try again.");
      setBattleState('idle');
      stopBGM();
    }
  };

  const resetBattle = () => {
    setBattleState('idle');
    setResults(null);
    setCountdown(null);
    setPrompt1('');
    setPrompt2('');
    stopBGM();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b-4 border-black bg-cream">
        <div className="flex items-center gap-4">
          <MorphingTitle />
        </div>
        <button 
          onClick={toggleMute}
          className="brutal-button bg-soft-violet p-3 rounded-none flex items-center justify-center"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 md:p-8">
        
        {error && (
          <div className="mb-6 bg-hot-red text-white font-bold p-4 brutal-border brutal-shadow w-full max-w-2xl text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {battleState === 'idle' && (
            <motion.div 
              key="input-zone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-6xl flex flex-col md:flex-row gap-8 md:gap-12 relative"
            >
              {/* VS Divider */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center justify-center pointer-events-none">
                <div className="w-1 h-32 bg-black mb-4" />
                <div className="font-display text-6xl font-black italic text-vivid-yellow text-stroke drop-shadow-[6px_6px_0_rgba(0,0,0,1)] bg-cream rounded-full p-4 brutal-border">
                  VS
                </div>
                <div className="w-1 h-32 bg-black mt-4" />
              </div>

              {/* Player 1 Input */}
              <div className="flex-1 flex flex-col">
                <div className="bg-hot-red text-white font-display font-black text-2xl uppercase p-3 brutal-border border-b-0 text-center tracking-widest">
                  Contender 1
                </div>
                <textarea
                  value={prompt1}
                  onChange={(e) => setPrompt1(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="w-full h-40 md:h-64 p-4 md:p-6 text-lg font-medium bg-white brutal-border brutal-shadow-lg resize-none focus:outline-none focus:ring-4 focus:ring-hot-red/50"
                />
              </div>

              {/* Player 2 Input */}
              <div className="flex-1 flex flex-col">
                <div className="bg-vivid-yellow text-black font-display font-black text-2xl uppercase p-3 brutal-border border-b-0 text-center tracking-widest">
                  Contender 2
                </div>
                <textarea
                  value={prompt2}
                  onChange={(e) => setPrompt2(e.target.value)}
                  placeholder="Enter opponent's prompt here..."
                  className="w-full h-40 md:h-64 p-4 md:p-6 text-lg font-medium bg-white brutal-border brutal-shadow-lg resize-none focus:outline-none focus:ring-4 focus:ring-vivid-yellow/50"
                />
              </div>
            </motion.div>
          )}

          {battleState === 'countdown' && (
            <motion.div 
              key="countdown"
              className="flex items-center justify-center h-64"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="font-display text-6xl md:text-9xl font-black text-hot-red text-stroke-white drop-shadow-[10px_10px_0_rgba(0,0,0,1)]"
              >
                {countdown === 0 ? "FIGHT!" : countdown}
              </motion.div>
            </motion.div>
          )}

          {battleState === 'battling' && (
            <motion.div 
              key="battling"
              className="flex flex-col items-center justify-center h-64 gap-8"
            >
              <Swords className="w-24 h-24 animate-clash text-hot-red" />
              <div className="font-display text-3xl font-bold uppercase animate-pulse">
                AI Judge is evaluating...
              </div>
            </motion.div>
          )}

          {battleState === 'results' && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Contender 1 Result */}
              <motion.div 
                className={`flex flex-col bg-white brutal-border p-6 relative ${results.winner === 1 ? 'brutal-shadow-lg z-10' : 'opacity-70 translate-y-4'}`}
                animate={results.winner === 1 ? { y: [0, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {results.winner === 1 && (
                  <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-vivid-yellow text-black font-display font-black p-2 md:p-4 rounded-full brutal-border animate-bounce-rotate z-20 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 text-sm md:text-base">
                    WINNER!
                  </div>
                )}
                <h2 className="font-display text-3xl font-black uppercase mb-6 bg-hot-red text-white inline-block px-4 py-2 brutal-border self-start">
                  Contender 1
                </h2>
                <div className="mb-6 font-medium text-lg italic border-l-4 border-hot-red pl-4">
                  "{prompt1}"
                </div>
                <div className="mt-auto">
                  <ScoreBar label="Creativity" score={results.scores.prompt1.creativity} colorClass="bg-hot-red" delay={0.2} />
                  <ScoreBar label="Clarity" score={results.scores.prompt1.clarity} colorClass="bg-vivid-yellow" delay={0.4} />
                  <ScoreBar label="Impact" score={results.scores.prompt1.impact} colorClass="bg-soft-violet" delay={0.6} />
                  <div className="mt-6 pt-4 border-t-4 border-black flex justify-between items-end">
                    <span className="font-display font-bold text-xl uppercase">Total Score</span>
                    <span className="font-display font-black text-5xl text-hot-red text-stroke-sm">
                      <AnimatedCounter value={results.scores.prompt1.total} />
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Contender 2 Result */}
              <motion.div 
                className={`flex flex-col bg-white brutal-border p-6 relative ${results.winner === 2 ? 'brutal-shadow-lg z-10' : 'opacity-70 translate-y-4'}`}
                animate={results.winner === 2 ? { y: [0, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {results.winner === 2 && (
                  <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-vivid-yellow text-black font-display font-black p-2 md:p-4 rounded-full brutal-border animate-bounce-rotate z-20 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 text-sm md:text-base">
                    WINNER!
                  </div>
                )}
                <h2 className="font-display text-3xl font-black uppercase mb-6 bg-vivid-yellow text-black inline-block px-4 py-2 brutal-border self-start">
                  Contender 2
                </h2>
                <div className="mb-6 font-medium text-lg italic border-l-4 border-vivid-yellow pl-4">
                  "{prompt2}"
                </div>
                <div className="mt-auto">
                  <ScoreBar label="Creativity" score={results.scores.prompt2.creativity} colorClass="bg-hot-red" delay={0.2} />
                  <ScoreBar label="Clarity" score={results.scores.prompt2.clarity} colorClass="bg-vivid-yellow" delay={0.4} />
                  <ScoreBar label="Impact" score={results.scores.prompt2.impact} colorClass="bg-soft-violet" delay={0.6} />
                  <div className="mt-6 pt-4 border-t-4 border-black flex justify-between items-end">
                    <span className="font-display font-bold text-xl uppercase">Total Score</span>
                    <span className="font-display font-black text-5xl text-vivid-yellow text-stroke-sm">
                      <AnimatedCounter value={results.scores.prompt2.total} />
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* AI Commentary */}
              <motion.div 
                className="col-span-1 md:col-span-2 bg-pure-black text-white p-6 brutal-border brutal-shadow-lg mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="text-vivid-yellow fill-vivid-yellow" />
                  <h3 className="font-display text-2xl font-black uppercase text-vivid-yellow">Judge's Commentary</h3>
                </div>
                <p className="text-xl font-medium leading-relaxed mb-4">
                  {results.commentary}
                </p>
                <div className="bg-white text-black p-4 font-display font-bold text-xl uppercase border-l-8 border-hot-red">
                  Verdict: {results.verdict}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-12 mb-8 z-20">
          {battleState === 'idle' && (
            <button 
              onClick={startBattle}
              className="brutal-button bg-hot-red text-white font-display font-black text-2xl md:text-4xl uppercase px-8 py-4 md:px-12 md:py-6 flex items-center gap-4 hover:bg-red-500"
            >
              <Zap className="w-8 h-8 md:w-10 md:h-10 fill-white" />
              Battle!
            </button>
          )}
          
          {battleState === 'results' && (
            <button 
              onClick={resetBattle}
              className="brutal-button bg-soft-violet text-black font-display font-black text-2xl uppercase px-8 py-4 flex items-center gap-3 hover:bg-purple-300"
            >
              <RotateCcw size={28} />
              New Battle
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-black bg-white p-4 flex flex-wrap justify-center items-center gap-3 font-display font-bold text-lg uppercase">
        <span>Built by</span>
        <CreatorLink 
          name="Aditya" 
          github="https://github.com/adimestry" 
          instagram="https://www.instagram.com/aditya_mestry_x007/" 
        />
        <span>and</span>
        <CreatorLink 
          name="Dhruv" 
          github="https://github.com/dhruvkasar" 
          instagram="https://www.instagram.com/dhruvvkasar/" 
        />
      </footer>
    </div>
  );
}
