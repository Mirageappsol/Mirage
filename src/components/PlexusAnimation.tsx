import React, { useEffect, useRef } from 'react';

const PlexusAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
  }>>([]);
  const requestRef = useRef<number>();
  const lastMouseMoveRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles function
    const initParticles = () => {
      const width = canvas.width;
      const height = canvas.height;
      particlesRef.current = Array.from({ length: 80 }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2
        };
      });
    };

    // Set canvas size and initialize particles
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = (timestamp: number) => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check if mouse is still moving
      const timeSinceLastMove = timestamp - lastMouseMoveRef.current;
      mouseRef.current.isMoving = timeSinceLastMove < 100;

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        if (mouseRef.current.isMoving) {
          // More active movement when mouse is moving
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.min(300 / (dist || 1), 10);

          if (dist < 300) {
            particle.vx += (dx / dist) * force * 0.4;
            particle.vy += (dy / dist) * force * 0.4;
          }

          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.92;
          particle.vy *= 0.92;
        } else {
          // Gentle return to base position when idle
          const dx = particle.baseX - particle.x;
          const dy = particle.baseY - particle.y;
          particle.vx += dx * 0.005;
          particle.vy += dy * 0.005;
          particle.x += particle.vx * 0.2;
          particle.y += particle.vy * 0.2;
          particle.vx *= 0.95;
          particle.vy *= 0.95;
        }

        // Keep particles within bounds
        if (particle.x < 0) particle.x = 0;
        if (particle.x > canvas.width) particle.x = canvas.width;
        if (particle.y < 0) particle.y = 0;
        if (particle.y > canvas.height) particle.y = canvas.height;

        // Draw connections
        particlesRef.current.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, other.x, other.y
            );
            const alpha = mouseRef.current.isMoving 
              ? (1 - dist / 150) * 0.8
              : (1 - dist / 150) * 0.3;
            
            gradient.addColorStop(0, `rgba(112, 40, 226, ${alpha})`);
            gradient.addColorStop(1, `rgba(0, 247, 255, ${alpha})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = mouseRef.current.isMoving ? 1.5 : 0.8;
            ctx.stroke();
          }
        });

        // Draw particle with glow effect
        const glow = mouseRef.current.isMoving ? 15 : 8;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glow
        );
        gradient.addColorStop(0, 'rgba(112, 40, 226, 0.4)');
        gradient.addColorStop(1, 'rgba(112, 40, 226, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = mouseRef.current.isMoving ? '#7028E2' : 'rgba(112, 40, 226, 0.6)';
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      lastMouseMoveRef.current = performance.now();
      mouseRef.current.isMoving = true;
    };

    document.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default PlexusAnimation;