import React from 'react';
import { Newspaper, Map, Shield, UserRound } from 'lucide-react';
import type { LucideIcon } from "lucide-react";

export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

export interface MobileNavBarProps {
    items?: NavItem[];
    activeId?: string;
    onItemClick?: (id: string) => void;
    onSosClick?: () => void;
}

const defaultItems: NavItem[] = [
    { id: 'feed', label: 'Feed', icon: Newspaper },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'report', label: 'Report', icon: Shield },
    { id: 'user', label: 'User', icon: UserRound },
];

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
    items = defaultItems,
    activeId = 'feed',
    onItemClick,
    onSosClick,
}) => {
    // Split items for left and right of the central SOS button
    const midIndex = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, midIndex);
    const rightItems = items.slice(midIndex);

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
            <nav 
                className="pointer-events-auto relative w-full h-[88px] box-content pb-[env(safe-area-inset-bottom)] bg-zinc-900 border-t border-zinc-800 shadow-2xl flex justify-between items-center px-2"
                aria-label="Bottom Navigation"
            >
                {/* Central SOS Button */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8 flex justify-center z-10">
                    <button
                        onClick={onSosClick}
                        aria-label="Emergency SOS"
                        className="group w-[92px] h-[92px] rounded-full bg-gradient-to-b from-red-500 to-red-700 border-8 border-zinc-900 shadow-[0_0_40px_rgba(239,68,68,0.45)] flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                    >
                        <span className="font-bold text-2xl tracking-wide group-hover:animate-pulse">SOS</span>
                    </button>
                </div>

                {/* Left Navigation Items */}
                <ul className="flex flex-1 justify-around h-full items-center m-0 p-0 list-none">
                    {leftItems.map((item) => (
                        <li key={item.id} className="h-full">
                            <NavItemComponent
                                item={item}
                                isActive={activeId === item.id}
                                onClick={() => onItemClick?.(item.id)}
                            />
                        </li>
                    ))}
                </ul>

                <div className="w-[100px] shrink-0" aria-hidden="true" />

                {/* Right Navigation Items */}
                <ul className="flex flex-1 justify-around h-full items-center m-0 p-0 list-none">
                    {rightItems.map((item) => (
                        <li key={item.id} className="h-full">
                            <NavItemComponent
                                item={item}
                                isActive={activeId === item.id}
                                onClick={() => onItemClick?.(item.id)}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

interface NavItemComponentProps {
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({ item, isActive, onClick }) => {
    const Icon = item.icon;
    
    return (
        <button    
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors duration-300 group outline-none ${
                isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {/* Builtin colors gamit, palitan if needed*/}
            <div 
                className={`relative flex items-center justify-center transition-all duration-300 ease-out ${
                    isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-110 group-hover:-translate-y-0.5 group-active:scale-95'
                }`}
            >
                <Icon strokeWidth={isActive ? 2.5 : 2} size={24} className="transition-all duration-300" />
            </div>
            <span 
                className={`text-[11px] transition-all duration-300 ease-out ${
                    isActive ? 'font-semibold tracking-wide' : 'font-medium'
                }`}
            >
                {item.label}
            </span>
        </button>
    );
};