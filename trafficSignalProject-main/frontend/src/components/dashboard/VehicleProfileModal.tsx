import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Car, AlertTriangle, Activity, MapPin, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VehicleProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: string | null;
}

const mockSpeedData = [
    { time: '0s', speed: 45 },
    { time: '2s', speed: 48 },
    { time: '4s', speed: 52 },
    { time: '6s', speed: 40 },
    { time: '8s', speed: 35 },
    { time: '10s', speed: 10 },
    { time: '12s', speed: 0 },
];

export default function VehicleProfileModal({ isOpen, onClose, vehicleId }: VehicleProfileModalProps) {
    if (!vehicleId) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-xl border-primary/20">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-8">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <Car size={24} />
                            </div>
                            <span>Vehicle Profile #{vehicleId}</span>
                        </DialogTitle>
                        <Badge variant="outline" className="text-lg px-3 py-1 border-primary text-primary neon-text-cyan">
                            CONFIDENCE: 98.4%
                        </Badge>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-6">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="glass-panel p-4 rounded-xl space-y-3">
                                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                        <Activity size={16} /> Status
                                    </h4>
                                    <div className="text-xl font-bold">Moving South</div>
                                    <div className="text-sm text-green-400">Low Risk</div>
                                </div>
                                <div className="glass-panel p-4 rounded-xl space-y-3">
                                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                        <Clock size={16} /> Current Speed
                                    </h4>
                                    <div className="text-3xl font-mono font-bold text-primary">
                                        45 <span className="text-base text-muted-foreground">km/h</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-4 rounded-xl relative overflow-hidden min-h-[200px] border border-white/10">
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    {/* Mock Map */}
                                    <div className="relative w-full h-full opacity-50">
                                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600" />
                                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-600" />
                                        {/* Trajectory */}
                                        <svg className="absolute inset-0 pointer-events-none">
                                            <path d="M 200 0 Q 300 200 400 300" stroke="#00f0ff" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                            <circle cx="400" cy="300" r="4" fill="#00f0ff" className="animate-pulse" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/80 text-xs px-2 py-1 rounded">
                                        <MapPin size={12} className="inline mr-1" />
                                        Last Seen: Cam-04
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="telemetry" className="mt-4">
                        <div className="glass-panel p-6 rounded-xl">
                            <h4 className="mb-4 text-sm font-semibold">Speed Profile (Last 12s)</h4>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockSpeedData}>
                                        <XAxis dataKey="time" stroke="#666" fontSize={12} />
                                        <YAxis stroke="#666" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                                            itemStyle={{ color: '#00f0ff' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="speed"
                                            stroke="#00f0ff"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#00f0ff' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="p-2 bg-destructive/20 rounded-lg text-destructive">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Signal Jump Detected</div>
                                        <div className="text-xs text-muted-foreground">Main Junction North • 2 days ago</div>
                                    </div>
                                    <div className="ml-auto text-sm font-mono text-destructive">PENDING</div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
