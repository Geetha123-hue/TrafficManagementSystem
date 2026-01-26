import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SignalPhaseTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll simulation
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let offset = 0;
        const animate = () => {
            offset += 0.5;
            if (offset >= 100) offset = 0;
            if (container) {
                container.style.transform = `translateX(-${offset}px)`;
            }
            requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, []);

    // Generate phase pattern
    const phases = Array.from({ length: 20 }).map((_, i) => {
        const type = ['red', 'green', 'yellow'][i % 3] as 'red' | 'green' | 'yellow';
        const width = type === 'yellow' ? 40 : 120;
        return { type, width, id: i };
    });

    return (
        <div className="glass-panel p-4 rounded-xl space-y-3 overflow-hidden">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-muted-foreground">Signal Phase Sync</h3>
                <div className="text-xs font-mono text-primary animate-pulse">LIVE SYNC</div>
            </div>

            <div className="relative h-12 w-full overflow-hidden bg-black/20 rounded-lg border border-white/5">
                {/* Center Marker Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 z-20 shadow-[0_0_10px_white]" />

                {/* Moving Timeline */}
                <div ref={containerRef} className="absolute left-1/2 top-2 h-8 flex items-center will-change-transform">
                    {phases.map((phase) => (
                        <div
                            key={phase.id}
                            className={`
                    h-6 shrink-0 flex items-center justify-center text-[10px] font-mono
                    border-r border-black/20
                    ${phase.type === 'red' ? 'bg-destructive/20 text-destructive border-destructive/30' : ''}
                    ${phase.type === 'green' ? 'bg-success/20 text-success border-success/30' : ''}
                    ${phase.type === 'yellow' ? 'bg-warning/20 text-warning border-warning/30' : ''}
                  `}
                            style={{ width: `${phase.width}px` }}
                        >
                            {phase.type.toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>Phase ID: #8821</span>
                <span>Cycle: 90s</span>
                <span>Next: All Red</span>
            </div>
        </div>
    );
}
