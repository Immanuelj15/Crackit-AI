import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    FiBox,
    FiDatabase,
    FiServer,
    FiShield,
    FiCpu,
    FiCloud,
    FiHardDrive,
    FiZap,
    FiPlay,
    FiTrash2,
    FiInfo,
    FiLayout,
    FiMessageSquare,
    FiChevronRight,
    FiPlus,
    FiSearch,
    FiX,
    FiLink,
    FiScissors
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const COMPONENTS = [
    { type: 'user', name: 'User/Client', icon: <FiBox />, color: 'indigo' },
    { type: 'lb', name: 'Load Balancer', icon: <FiShield />, color: 'sky' },
    { type: 'web', name: 'Web Server', icon: <FiServer />, color: 'emerald' },
    { type: 'app', name: 'App Server', icon: <FiCpu />, color: 'violet' },
    { type: 'db', name: 'Database', icon: <FiDatabase />, color: 'rose' },
    { type: 'cache', name: 'Cache (Redis)', icon: <FiZap />, color: 'amber' },
    { type: 'mq', name: 'Message Queue', icon: <FiHardDrive />, color: 'orange' },
    { type: 'cdn', name: 'CDN', icon: <FiCloud />, color: 'blue' },
];

const SystemDesign = () => {
    const [canvasItems, setCanvasItems] = useState([]);
    const [connections, setConnections] = useState([]);
    const [auditFeedback, setAuditFeedback] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [showPalette, setShowPalette] = useState(true);
    const [linkingMode, setLinkingMode] = useState(false);
    const [linkingFrom, setLinkingFrom] = useState(null);
    const canvasRef = useRef(null);

    const addComponent = (comp) => {
        const newItem = {
            id: Date.now(),
            ...comp,
            x: Math.random() * 200 + 100,
            y: Math.random() * 200 + 100,
        };
        setCanvasItems([...canvasItems, newItem]);
    };

    const removeComponent = (id) => {
        setCanvasItems(canvasItems.filter(item => item.id !== id));
        setConnections(connections.filter(conn => conn.fromId !== id && conn.toId !== id));
        if (linkingFrom === id) setLinkingFrom(null);
    };

    const handleComponentClick = (id) => {
        if (!linkingMode) return;

        if (linkingFrom === null) {
            setLinkingFrom(id);
        } else if (linkingFrom === id) {
            setLinkingFrom(null);
        } else {
            // Check if connection already exists
            const exists = connections.some(c =>
                (c.fromId === linkingFrom && c.toId === id) ||
                (c.fromId === id && c.toId === linkingFrom)
            );

            if (!exists) {
                setConnections([...connections, { fromId: linkingFrom, toId: id }]);
            }
            setLinkingFrom(null);
        }
    };

    const updateItemPos = (id, x, y) => {
        setCanvasItems(items => items.map(item =>
            item.id === id ? { ...item, x, y } : item
        ));
    };

    const handleAudit = async () => {
        if (canvasItems.length === 0) return;
        setIsAuditing(true);
        setAuditFeedback('');

        try {
            const componentsList = canvasItems.map(item => item.name).join(', ');
            const connectionsList = connections.map(conn => {
                const from = canvasItems.find(i => i.id === conn.fromId)?.name;
                const to = canvasItems.find(i => i.id === conn.toId)?.name;
                return `${from} -> ${to}`;
            }).join(', ');

            const prompt = `As a Senior System Design Architect, audit this infrastructure:
Components: [${componentsList}]
Connections: [${connectionsList}]

Identify potential single points of failure (SPoF), scalability bottlenecks, and recommendation 2-3 specific improvements. Evaluate if the flow makes sense (e.g., Load Balancer before Web Servers). Keep it concise and professional.`;

            const { data } = await axios.post('/api/ai/chat', {
                message: prompt
            }, { withCredentials: true });

            setAuditFeedback(data.reply);
        } catch (error) {
            setAuditFeedback("Failed to get review. Please try again later.");
        } finally {
            setIsAuditing(false);
        }
    };

    return (
        <div className="h-screen bg-slate-50 dark:bg-[#0f1115] text-slate-700 dark:text-slate-300 flex overflow-hidden transition-colors duration-300">
            {/* Sidebar Palette */}
            <AnimatePresence>
                {showPalette && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="w-72 bg-white dark:bg-[#1a1d24] border-r border-slate-200 dark:border-white/5 flex flex-col z-50 shadow-2xl"
                    >
                        <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <FiLayout className="text-indigo-500" /> Component Palette
                            </h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Drag or click to add</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {COMPONENTS.map((comp) => (
                                <button
                                    key={comp.type}
                                    onClick={() => addComponent(comp)}
                                    className="w-full group p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center gap-4 transition-all hover:border-indigo-500/50 hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/5"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-${comp.color}-500/10 text-${comp.color}-500 flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                                        {comp.icon}
                                    </div>
                                    <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">{comp.name}</span>
                                    <FiPlus className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-indigo-500/5">
                            <div className="flex items-center gap-2 mb-3">
                                <FiInfo className="text-indigo-500" />
                                <span className="text-[10px] font-black uppercase text-slate-400">Pro Tip</span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">
                                Build a scalable "Instagram" architecture. Start with a Load Balancer and multiple App Servers.
                            </p>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Canvas Area */}
            <main className="flex-1 relative flex flex-col overflow-hidden">
                {/* Canvas Header */}
                <header className="h-16 px-8 flex items-center justify-between bg-white/70 dark:bg-[#1a1d24]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowPalette(!showPalette)}
                            className={`p-2 rounded-xl transition-all ${showPalette ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}
                        >
                            <FiLayout />
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                            System Design <span className="text-indigo-500">Playground</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setLinkingMode(!linkingMode);
                                setLinkingFrom(null);
                            }}
                            className={`p-2.5 rounded-xl border transition-all shadow-sm flex items-center gap-2 ${linkingMode ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400'}`}
                            title="Connect Components"
                        >
                            <FiLink />
                            {linkingMode && <span className="text-[10px] font-black uppercase tracking-tighter">Link Mode</span>}
                        </button>
                        <button
                            onClick={() => setConnections([])}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-red-500 transition-all shadow-sm"
                            title="Clear Connections"
                        >
                            <FiScissors />
                        </button>
                        <button
                            onClick={() => {
                                setCanvasItems([]);
                                setConnections([]);
                            }}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-red-500 transition-all shadow-sm"
                            title="Clear Canvas"
                        >
                            <FiTrash2 />
                        </button>
                        <button
                            onClick={handleAudit}
                            disabled={isAuditing || canvasItems.length === 0}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95"
                        >
                            {isAuditing ? (
                                <div className="animate-spin h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full"></div>
                            ) : <FiCpu strokeWidth={3} />}
                            Audit Architecture
                        </button>
                    </div>
                </header>

                {/* The Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 bg-slate-50 dark:bg-[#0f1115] relative overflow-hidden transition-colors"
                >
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>

                    {/* SVG Connection Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-indigo-500/50" />
                            </marker>
                        </defs>
                        {connections.map((conn, idx) => {
                            const from = canvasItems.find(i => i.id === conn.fromId);
                            const to = canvasItems.find(i => i.id === conn.toId);
                            if (!from || !to) return null;

                            // Center points (offset by half of component width/height: 28*4 = 112 / 2 = 56px)
                            const x1 = from.x + 56;
                            const y1 = from.y + 56;
                            const x2 = to.x + 56;
                            const y2 = to.y + 56;

                            return (
                                <motion.line
                                    key={`${conn.fromId}-${conn.toId}`}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    x1={x1} y1={y1} x2={x2} y2={y2}
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray="8,6"
                                    className="text-indigo-500/40"
                                    markerEnd="url(#arrowhead)"
                                />
                            );
                        })}
                    </svg>

                    {canvasItems.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 grayscale select-none">
                            <FiLayout size={120} className="mb-6 animate-pulse" />
                            <p className="text-sm font-black uppercase tracking-widest">Drag components here to start designing</p>
                        </div>
                    )}

                    {canvasItems.map((item) => (
                        <motion.div
                            key={item.id}
                            drag
                            dragMomentum={false}
                            dragConstraints={canvasRef}
                            onDrag={(e, info) => {
                                // Real-time position update for lines
                                updateItemPos(item.id, item.x + info.delta.x, item.y + info.delta.y);
                            }}
                            onClick={() => handleComponentClick(item.id)}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                outline: linkingFrom === item.id ? '4px solid #6366f1' : '0px solid transparent'
                            }}
                            className={`absolute w-28 h-28 cursor-grab active:cursor-grabbing group z-10 ${linkingMode ? 'cursor-pointer' : ''}`}
                            style={{ x: item.x, y: item.y }}
                        >
                            <div className={`relative w-full h-full p-6 bg-white dark:bg-[#1a1d24] border rounded-3xl shadow-lg transition-all ${linkingFrom === item.id ? 'border-indigo-500 shadow-indigo-500/20' : 'border-slate-200 dark:border-white/5'} group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10 flex flex-col items-center justify-center text-center`}>
                                <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 text-${item.color}-500 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 leading-none">{item.name}</span>

                                <button
                                    onClick={() => removeComponent(item.id)}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                                >
                                    <FiX size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Review Panel */}
                <AnimatePresence>
                    {auditFeedback && (
                        <motion.section
                            initial={{ y: 300, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 300, opacity: 0 }}
                            className="absolute bottom-6 left-6 right-6 p-8 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><FiCpu size={120} className="text-white" /></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">✨</div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Architectural Review</h3>
                                    </div>
                                    <button
                                        onClick={() => setAuditFeedback('')}
                                        className="text-white/40 hover:text-white transition-colors"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>

                                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-medium">
                                    <ReactMarkdown>{auditFeedback}</ReactMarkdown>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                                    <button
                                        onClick={handleAudit}
                                        className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Re-Audit
                                    </button>
                                    <button
                                        className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                    >
                                        Apply Suggestions
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SystemDesign;
