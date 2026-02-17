import React, { useRef, useState, useEffect } from 'react';
import { FiX, FiTrash2, FiEdit2, FiMinus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Whiteboard = ({ isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(3);
    const [tool, setTool] = useState('pen'); // pen, eraser

    // Initialize Canvas
    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set canvas size to match window or container
            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // Restore context settings after resize reset
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [isOpen]);

    // Update Context when settings change
    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
            ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
        }
    }, [color, lineWidth, tool]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (nativeEvent) => {
        if (nativeEvent.touches && nativeEvent.touches.length > 0) {
            const touch = nativeEvent.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            };
        }
        return {
            offsetX: nativeEvent.offsetX,
            offsetY: nativeEvent.offsetY
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm cursor-crosshair touch-none"
            >
                {/* Toolbar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white shadow-xl px-6 py-3 rounded-2xl border border-gray-200 z-50">
                    {/* Colors */}
                    <div className="flex gap-2 border-r border-gray-200 pr-4">
                        {['#000000', '#ef4444', '#3b82f6', '#10b981'].map((c) => (
                            <button
                                key={c}
                                onClick={() => { setColor(c); setTool('pen'); }}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === 'pen' ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                    </div>

                    {/* Tools */}
                    <div className="flex gap-2 border-r border-gray-200 pr-4">
                        <button
                            onClick={() => setTool('pen')}
                            className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-sky-100 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Pen"
                        >
                            <FiEdit2 size={20} />
                        </button>
                        <button
                            onClick={() => setTool('eraser')}
                            className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-sky-100 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Eraser"
                        >
                            <FiMinus size={20} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={clearCanvas}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Clear All"
                        >
                            <FiTrash2 size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors ml-2 border-l border-gray-200 pl-4"
                            title="Close"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full block"
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default Whiteboard;
