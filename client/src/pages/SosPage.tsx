import type React from "react"
import { BriefcaseMedical, FireExtinguisher, Cctv, WavesArrowUp, LifeBuoy, Activity, MapPin } from 'lucide-react';
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";

interface SosPageProps {
    items?: SpecificEmergency[];
}

interface SpecificEmergency {
    id: string;
    label: string;
    icon: LucideIcon;
}

const defaultItems: SpecificEmergency[] = [
    { id: 'medical', label: 'Medical', icon: BriefcaseMedical },
    { id: 'fire', label: 'Fire', icon: FireExtinguisher },
    { id: 'crime', label: 'Crime/Police', icon: Cctv },
    { id: 'flood', label: 'Flood', icon: WavesArrowUp },
    { id: 'earthquake', label: 'Earthquake', icon: Activity },
    { id: 'rescue', label: 'Rescue', icon: LifeBuoy },
]

export const SosPage: React.FC<SosPageProps> = ({
    items = defaultItems,
}) => {
    const [selectedEmergency, setSelectedEmergency] = useState('general');
    const [timeLeft, setTimeLeft] = useState(3);
    const [signalEmergency, setSignalEmergency] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearCountdown = () => {
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    };

    const startHold = () => {
        setIsHolding(true);
        setTimeLeft(3);
        setSignalEmergency(false);
        clearCountdown();

        countdownRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearCountdown();
                    setSignalEmergency(true);
                    setIsHolding(false);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);
    };

    const stopHold = () => {
        if (signalEmergency) {
            return;
        }

        clearCountdown();
        setIsHolding(false);
        setTimeLeft(3);
    };

    const onSelectEmergency = (id: string) => {
        setSelectedEmergency(id)
    }

    return (
        <div className="flex flex-col gap-4 p-12 pb-80 min-h-screen items-center justify-center bg-[var(--theme-bg)] px-4 py-8 font-sans text-slate-100 antialiased select-none md:pb-12">
            <div className="flex flex-col items-center gap-4">
                <SosButton onStartHold={startHold} onStopHold={stopHold} timeLeft={timeLeft} isHolding={isHolding} />
                {signalEmergency ?
                    <EmergencyNotification estimatedTime={"n"} location={"[location]"} selectedEmergency={selectedEmergency} /> :
                    <p className="max-w-xs text-center text-sm text-slate-400">
                        Emergency assistance will be sent to your trusted contacts / LGUs.
                    </p>
                }
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between gap-5">
                    <p className="max-w-xs font-semibold text-center text-sm text-slate-600">
                        SPECIFIC EMERGENCY TYPE
                    </p>
                    <p className="max-w-xs font-semibold text-center text-sm text-slate-400">
                        Select one
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {items.map((item) => (
                        <SpecificEmergencyItem
                            key={item.id}
                            item={item}
                            isActive={selectedEmergency === item.id}
                            onClick={onSelectEmergency}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

interface SosButtonProps {
    onStartHold: () => void;
    onStopHold: () => void;
    timeLeft: number;
    isHolding: boolean;
}

export const SosButton: React.FC<SosButtonProps> = ({ onStartHold, onStopHold, timeLeft, isHolding }) => {
    return (
        <div className="rounded-full border border-red-500/20 bg-red-500/10 p-4 shadow-[0_0_0_12px_rgba(239,68,68,0.08)]">
            <button className="group relative inline-flex h-45 w-45 flex-col items-center justify-center rounded-full border border-red-400/40 bg-[color:var(--color-red)] text-black shadow-[0_14px_45px_rgba(248,113,113,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-[color:var(--color-red)]/90 hover:shadow-[0_18px_55px_rgba(248,113,113,0.4)] focus:outline-none focus:ring-4 focus:ring-red-400/30 active:scale-[0.98]"
                onMouseDown={onStartHold}
                onMouseUp={onStopHold}
                onMouseLeave={onStopHold} // if cursor wanders off
                onTouchStart={onStartHold} // Mobile support
                onTouchEnd={onStopHold} >
                <span className="absolute inset-0 rounded-full border border-white/20" />
                <span className="absolute inset-2 rounded-full border border-black/10" />
                <span className="relative text-5xl font-black text-white tracking-[0.25em]">SOS</span>
                <span className="relative mt-2 text-sm font-semibold text-white/90">
                    {isHolding ? `${timeLeft}s` : 'Hold 3s to signal'}
                </span>
            </button >
        </div>
    )
}

interface EmergencyNotificationProps {
    estimatedTime: string;
    location: string;
    selectedEmergency?: string;
}

export const EmergencyNotification: React.FC<EmergencyNotificationProps> = ({
    estimatedTime = 'n/a', location = 'n/a', selectedEmergency
}) => {
    return (
        <div className="p-3 w-80 rounded-lg border border-slate-800 border-l-4 cursor-pointer transition-all duration-200 border-l-blue-500 bg-[var(--theme-surface)] border-[var(--theme-accent)]/50 shadow-[0_0_10px_var(--theme-accent-glow)]">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-blue-400">SOS SENT</span>
                {/* TODO: estimated time. pede rin oras na nilagay yung emergency*/}
                <span className="text-[10px] text-slate-500 font-mono">EST {estimatedTime} MIN</span>
            </div>
            <p className="text-xs text-slate-300 font-medium truncate">
                {/* TODO: current location. */}
                <span className="flex flex-row gap-2"><MapPin size={16} />{location}</span>
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-1">Emergency: {selectedEmergency}</p>
        </div>
    )
}

interface SpecificEmergencyProps {
    item: SpecificEmergency;
    isActive: boolean;
    onClick: (id: string) => void;
}

export const SpecificEmergencyItem: React.FC<SpecificEmergencyProps> = ({ item, isActive, onClick }) => {
    const Icon = item.icon
    return (
        <button
            onClick={() => onClick(item.id)}
            className={`flex flex-col items-center justify-center w-25 rounded-lg h-full gap-1 transition-colors bg-[var(--theme-surface)] border border-slate-900 p-4 duration-300 group outline-none ${isActive ? 'text-[var(--theme-blue)]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            aria-current={isActive ? 'page' : undefined}
        >
            <div
                className={`relative flex items-center justify-center transition-all duration-300 ease-out ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-110 group-hover:-translate-y-0.5 group-active:scale-95'
                    }`}
            >
                <Icon strokeWidth={isActive ? 2.5 : 2} size={24} className="transition-all duration-300" />
            </div>
            <span
                className={`text-[11px] transition-all duration-300 ease-out ${isActive ? 'font-semibold tracking-wide' : 'font-medium'
                    }`}
            >
                {item.label}
            </span>
        </button>
    )
}