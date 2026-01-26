import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HeatmapOverlay({ visible }: { visible: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!visible || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const points: { x: number; y: number; r: number; dx: number; dy: number }[] = [];

        // Initialize random heat points
        for (let i = 0; i < 15; i++) {
            points.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 30 + Math.random() * 50,
                dx: (Math.random() - 0.5) * 2,
                dy: (Math.random() - 0.5) * 2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            points.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;

                // Bounce off walls
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                // Draw radial gradient for each point
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                g.addColorStop(0, 'rgba(255, 50, 50, 0.4)'); // Red center
                g.addColorStop(0.5, 'rgba(255, 165, 0, 0.2)'); // Orange mid
                g.addColorStop(1, 'rgba(0, 255, 0, 0)'); // Transparent green edges

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrame);
    }, [visible]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-10"
        >
            <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-full opacity-60 mix-blend-screen Filter blur-xl"
            />

            {/* Legend */}
            {visible && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-white/80">Density Heatmap</span>
                    <div className="w-32 h-2 bg-gradient-to-r from-green-500 via-orange-500 to-red-500 rounded-full" />
                    <div className="flex justify-between text-[10px] text-white/50">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
