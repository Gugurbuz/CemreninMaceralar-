
import { useEffect, useRef } from 'react';
import { InputState } from '../types';

export const useGameInput = (isActive: boolean) => {
    const inputs = useRef<InputState>({});

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { 
            // Prevent scrolling with arrows ONLY if game is active
            if(isActive && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight', ' '].indexOf(e.key) > -1) {
                e.preventDefault();
            }
    
            // Jump Buffer Logic: Track "Fresh" presses
            if (!inputs.current[e.key]) { 
                 inputs.current[e.key + 'IsFresh'] = true;
            }
            inputs.current[e.key] = true; 
        };
        
        const handleKeyUp = (e: KeyboardEvent) => { 
            inputs.current[e.key] = false; 
            inputs.current[e.key + 'IsFresh'] = false;
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isActive]);

    // Helper for Mobile Controls
    const setInput = (key: string, active: boolean) => {
        if (active) {
            if (!inputs.current[key]) {
                inputs.current[key + 'IsFresh'] = true;
            }
            inputs.current[key] = true;
        } else {
            inputs.current[key] = false;
            inputs.current[key + 'IsFresh'] = false;
        }
    };

    return { inputs, setInput };
};
