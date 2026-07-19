import type React from "react"
import { BriefcaseMedical, FireExtinguisher, Cctv, WavesArrowUp, LifeBuoy, Activity } from 'lucide-react';
import type { LucideIcon } from "lucide-react";

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
    { id: 'crime', label: 'Crime', icon: Cctv },
    { id: 'flood', label: 'Flood', icon: WavesArrowUp },
    { id: 'earthquake', label: 'Earthquake', icon: Activity },
    { id: 'rescue', label: 'Rescue', icon: LifeBuoy },
]

export const SosPage: React.FC<SosPageProps> = ({
    items = defaultItems,
}) => {
    return (
        <div className="flex flex-col gap-4 p-12 min-h-screen items-center justify-center bg-[var(--theme-bg)] px-4 py-8 font-sans text-slate-100 antialiased select-none">
            <div className="flex flex-col items-center gap-4">
                <div className="rounded-full border border-red-500/20 bg-red-500/10 p-4 shadow-[0_0_0_12px_rgba(239,68,68,0.08)]">
                    <button className="group relative inline-flex h-45 w-45 flex-col items-center justify-center rounded-full border border-red-400/40 bg-[color:var(--color-red)] text-black shadow-[0_14px_45px_rgba(248,113,113,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-[color:var(--color-red)]/90 hover:shadow-[0_18px_55px_rgba(248,113,113,0.4)] focus:outline-none focus:ring-4 focus:ring-red-400/30 active:scale-[0.98]">
                        <span className="absolute inset-0 rounded-full border border-white/20" />
                        <span className="absolute inset-2 rounded-full border border-black/10" />
                        <span className="relative text-5xl font-black text-white tracking-[0.25em]">SOS</span>
                        <span className="relative mt-2 text-sm font-medium text-white text-black/80">Hold 3s to signal</span>
                    </button>
                </div>

                <p className="max-w-xs text-center text-sm text-slate-400">
                    Emergency assistance will be sent to your trusted contacts / LGUs.
                </p>
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
                            isActive={false}
                            onClick={() => { }}
                        />
                    ))}

                </div>
            </div>
        </div>
    )
}

interface SpecificEmergencyProps {
    item: SpecificEmergency;
    isActive: boolean;
    onClick: () => void;
}

export const SpecificEmergencyItem: React.FC<SpecificEmergencyProps> = ({ item, isActive, onClick }) => {
    const Icon = item.icon
    return (
        <button
            onClick={onClick}
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