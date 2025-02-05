import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';

interface DraggableWindowProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  width?: string;
  headerActions?: React.ReactNode;
}

const DraggableWindow = ({
  title,
  onClose,
  children,
  defaultPosition = { x: 32, y: 96 },
  width = '400px',
  headerActions
}: DraggableWindowProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(1000);
  const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const [size, setSize] = useState({ width: parseInt(width), height: 400 });
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (nodeRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementWidth = nodeRef.current.offsetWidth;
        const elementHeight = nodeRef.current.offsetHeight;

        setBounds({
          left: 0,
          top: 0,
          right: Math.max(0, windowWidth - elementWidth),
          bottom: Math.max(0, windowHeight - elementHeight)
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [size]);

  const handleStart = () => {
    setIsDragging(true);
    setZIndex(prev => Math.max(1001, prev + 1));
  };

  const handleStop = () => {
    setIsDragging(false);
  };

  const startResize = (e: React.MouseEvent) => {
    if (nodeRef.current) {
      e.preventDefault();
      const rect = nodeRef.current.getBoundingClientRect();
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect.width,
        startHeight: rect.height
      };
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    }
  };

  const handleResize = (e: MouseEvent) => {
    if (resizeRef.current && nodeRef.current) {
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;
      
      const newWidth = Math.max(300, Math.min(1200, resizeRef.current.startWidth + deltaX));
      const newHeight = Math.max(200, Math.min(800, resizeRef.current.startHeight + deltaY));
      
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const stopResize = () => {
    resizeRef.current = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds={bounds}
      onStart={handleStart}
      onStop={handleStop}
      defaultPosition={defaultPosition}
    >
      <div
        ref={nodeRef}
        className={`absolute rounded-2xl overflow-hidden ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{ 
          width: size.width,
          height: size.height,
          zIndex,
          transition: isDragging ? 'none' : 'all 0.2s ease'
        }}
      >
        {/* Outer glow and gradient border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7028E2]/20 via-[#4A90E2]/20 to-[#00F7FF]/20 rounded-2xl blur-sm" />
        
        {/* Main window background */}
        <div className="relative w-full h-full bg-[#0a0b1e]/95 backdrop-blur-xl rounded-2xl border border-[#7028E2]/10">
          {/* Header */}
          <div className="relative">
            {/* Glowing line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7028E2]/30 to-transparent" />
            
            <div 
              className="drag-handle p-4 flex items-center justify-between select-none bg-gradient-to-r from-[#0f172a]/80 via-[#1e293b]/80 to-[#0f172a]/80 border-b border-[#7028E2]/10"
              onMouseDown={() => setZIndex(prev => Math.max(1001, prev + 1))}
            >
              <div className="flex items-center gap-3">
                {/* Title with gradient text */}
                <h2 className="text-xl font-orbitron font-semibold tracking-wide bg-gradient-to-r from-white via-[#7028E2] to-white bg-clip-text text-transparent">
                  {title}
                </h2>
                {headerActions && (
                  <div onClick={e => e.stopPropagation()} className="no-drag">
                    {headerActions}
                  </div>
                )}
              </div>
              <button 
                onClick={onClose}
                className="text-white/60 hover:text-white/90 transition-colors cursor-pointer no-drag group"
              >
                <X size={20} className="transform group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Content with custom scrollbar */}
          <div 
            className="no-drag overflow-auto custom-scrollbar"
            style={{ 
              height: `calc(${size.height}px - 64px)`,
              background: 'linear-gradient(180deg, rgba(10, 11, 30, 0.3) 0%, rgba(10, 11, 30, 0.4) 100%)'
            }}
          >
            {/* Button Style Overrides */}
            <style>
              {`
                .window-button {
                  position: relative;
                  padding: 0.5rem 1rem;
                  border-radius: 0.75rem;
                  font-family: 'Space Grotesk', sans-serif;
                  font-weight: 500;
                  transition: all 0.3s ease;
                  background: linear-gradient(135deg, rgba(112, 40, 226, 0.1), rgba(0, 247, 255, 0.1));
                  border: 1px solid rgba(112, 40, 226, 0.2);
                  color: rgba(255, 255, 255, 0.9);
                  overflow: hidden;
                }

                .window-button::before {
                  content: '';
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(135deg, rgba(112, 40, 226, 0.2), rgba(0, 247, 255, 0.2));
                  opacity: 0;
                  transition: opacity 0.3s ease;
                }

                .window-button::after {
                  content: '';
                  position: absolute;
                  inset: -1px;
                  background: linear-gradient(135deg, rgba(112, 40, 226, 0.5), rgba(0, 247, 255, 0.5));
                  opacity: 0;
                  transition: opacity 0.3s ease;
                  border-radius: 0.75rem;
                  z-index: -1;
                }

                .window-button:hover {
                  transform: translateY(-1px);
                  border-color: rgba(112, 40, 226, 0.4);
                  box-shadow: 
                    0 4px 12px rgba(112, 40, 226, 0.1),
                    0 0 0 1px rgba(112, 40, 226, 0.2);
                }

                .window-button:hover::before {
                  opacity: 1;
                }

                .window-button:hover::after {
                  opacity: 0.2;
                }

                .window-button:active {
                  transform: translateY(0);
                }

                .window-button-primary {
                  background: linear-gradient(135deg, rgba(112, 40, 226, 0.2), rgba(0, 247, 255, 0.2));
                  border-color: rgba(112, 40, 226, 0.3);
                }

                .window-button-primary:hover {
                  border-color: rgba(112, 40, 226, 0.5);
                  box-shadow: 
                    0 4px 12px rgba(112, 40, 226, 0.15),
                    0 0 0 1px rgba(112, 40, 226, 0.3);
                }

                .window-button-success {
                  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
                  border-color: rgba(16, 185, 129, 0.3);
                }

                .window-button-success:hover {
                  border-color: rgba(16, 185, 129, 0.5);
                  box-shadow: 
                    0 4px 12px rgba(16, 185, 129, 0.15),
                    0 0 0 1px rgba(16, 185, 129, 0.3);
                }

                .window-button-warning {
                  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
                  border-color: rgba(245, 158, 11, 0.3);
                }

                .window-button-warning:hover {
                  border-color: rgba(245, 158, 11, 0.5);
                  box-shadow: 
                    0 4px 12px rgba(245, 158, 11, 0.15),
                    0 0 0 1px rgba(245, 158, 11, 0.3);
                }

                .window-button-danger {
                  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
                  border-color: rgba(239, 68, 68, 0.3);
                }

                .window-button-danger:hover {
                  border-color: rgba(239, 68, 68, 0.5);
                  box-shadow: 
                    0 4px 12px rgba(239, 68, 68, 0.15),
                    0 0 0 1px rgba(239, 68, 68, 0.3);
                }

                .window-input {
                  background: rgba(10, 11, 30, 0.6);
                  border: 1px solid rgba(112, 40, 226, 0.2);
                  border-radius: 0.75rem;
                  padding: 0.5rem 1rem;
                  color: white;
                  transition: all 0.3s ease;
                }

                .window-input:focus {
                  outline: none;
                  border-color: rgba(112, 40, 226, 0.4);
                  box-shadow: 
                    0 0 0 1px rgba(112, 40, 226, 0.2),
                    0 4px 12px rgba(112, 40, 226, 0.1);
                }

                .window-card {
                  background: rgba(10, 11, 30, 0.6);
                  border: 1px solid rgba(112, 40, 226, 0.2);
                  border-radius: 1rem;
                  padding: 1rem;
                  transition: all 0.3s ease;
                }

                .window-card:hover {
                  border-color: rgba(112, 40, 226, 0.4);
                  box-shadow: 
                    0 4px 12px rgba(112, 40, 226, 0.1),
                    0 0 0 1px rgba(112, 40, 226, 0.2);
                }
              `}
            </style>

            {children}
          </div>

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize group"
            onMouseDown={startResize}
          >
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#7028E2]/20 rounded-bl transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-[#7028E2]/40 rounded-bl transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute bottom-3 right-3 w-1 h-1 bg-[#7028E2]/60 rounded-bl transform group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#7028E2]/20" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#7028E2]/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#7028E2]/20" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#7028E2]/20" />
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableWindow;