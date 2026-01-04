
import React from 'react';

interface MobileControlsProps {
    onInput: (key: string, active: boolean) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onInput }) => {
    
    const handleTouchEnd = (e: React.TouchEvent, key: string) => {
        e.preventDefault();
        onInput(key, false);
    };

    return (
        <div className="absolute inset-x-0 bottom-0 pointer-events-none flex flex-col justify-end p-6 z-40">
            <div className="flex justify-between w-full items-end pb-4">
                {/* D-Pad */}
                <div className="flex gap-4 pointer-events-auto">
                    <button 
                        className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/40 active:bg-white/40 flex items-center justify-center text-3xl select-none"
                        onTouchStart={(e) => { e.preventDefault(); onInput('ArrowLeft', true); }}
                        onTouchEnd={(e) => handleTouchEnd(e, 'ArrowLeft')}
                        onTouchCancel={(e) => handleTouchEnd(e, 'ArrowLeft')}
                        aria-label="Sol"
                    >
                        ⬅️
                    </button>
                    <button 
                        className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/40 active:bg-white/40 flex items-center justify-center text-3xl select-none"
                        onTouchStart={(e) => { e.preventDefault(); onInput('ArrowRight', true); }}
                        onTouchEnd={(e) => handleTouchEnd(e, 'ArrowRight')}
                        onTouchCancel={(e) => handleTouchEnd(e, 'ArrowRight')}
                        aria-label="Sağ"
                    >
                        ➡️
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pointer-events-auto">
                     <button 
                        className="w-14 h-14 bg-purple-500/50 backdrop-blur-md rounded-full border-2 border-white/40 active:bg-purple-500/80 flex items-center justify-center text-2xl select-none text-white font-bold"
                        onTouchStart={(e) => { e.preventDefault(); onInput('t', true); }}
                        onTouchEnd={(e) => handleTouchEnd(e, 't')}
                        onTouchCancel={(e) => handleTouchEnd(e, 't')}
                        aria-label="Teleport"
                    >
                        T
                    </button>
                    <button 
                        className="w-20 h-20 bg-green-500/50 backdrop-blur-md rounded-full border-2 border-white/40 active:bg-green-500/80 flex items-center justify-center text-4xl select-none"
                        onTouchStart={(e) => { e.preventDefault(); onInput('ArrowUp', true); }}
                        onTouchEnd={(e) => handleTouchEnd(e, 'ArrowUp')}
                        onTouchCancel={(e) => handleTouchEnd(e, 'ArrowUp')}
                        aria-label="Zıpla"
                    >
                        ⬆️
                    </button>
                </div>
            </div>
        </div>
    );
};
