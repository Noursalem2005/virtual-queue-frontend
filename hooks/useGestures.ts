/**
 * GESTURE & HOTKEY LAYER - Translates touch/keyboard into commands
 * Supports: Keyboard hotkeys (S, N, P), Swipe gestures, Chord gestures (Cmd+K)
 * Game-like feel with audio feedback
 */

import { useEffect, useRef } from 'react';
import { useCommandBus, Command } from './useCommandBus';

interface GestureConfig {
  hotkeys: Record<string, Command>;
  swipeActions: Record<'left' | 'right' | 'up' | 'down', Command>;
}

export const useGestures = (config: GestureConfig) => {
  const { execute } = useCommandBus();
  const touchStartRef = useRef({ x: 0, y: 0 });
  const commandPaletteOpenRef = useRef(false);

  useEffect(() => {
    // HOTKEY LISTENERS
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K opens command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        commandPaletteOpenRef.current = !commandPaletteOpenRef.current;
        window.dispatchEvent(new CustomEvent('TOGGLE_COMMAND_PALETTE'));
        playSound('pop');
        return;
      }

      // Single key hotkeys (only if not typing in input)
      const activeEl = document.activeElement as HTMLElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      if (!isInput && config.hotkeys[e.key]) {
        e.preventDefault();
        execute(config.hotkeys[e.key]);
        playSound('click');
      }

      // Vim-style navigation (hjkl)
      if (!isInput && e.key === 'h') {
        execute({ type: 'NAVIGATE_VIEW', view: 'previous' });
      }
      if (!isInput && e.key === 'l') {
        execute({ type: 'NAVIGATE_VIEW', view: 'next' });
      }
      if (!isInput && e.key === 'j') {
        window.dispatchEvent(new CustomEvent('SCROLL_DOWN'));
      }
      if (!isInput && e.key === 'k') {
        window.dispatchEvent(new CustomEvent('SCROLL_UP'));
      }
    };

    // SWIPE GESTURE LISTENERS
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      const diffX = touchEnd.x - touchStartRef.current.x;
      const diffY = touchEnd.y - touchStartRef.current.y;
      const SWIPE_THRESHOLD = 50;

      // Determine swipe direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > SWIPE_THRESHOLD && config.swipeActions.left) {
          execute(config.swipeActions.left);
          playSound('swish');
        } else if (diffX < -SWIPE_THRESHOLD && config.swipeActions.right) {
          execute(config.swipeActions.right);
          playSound('swish');
        }
      } else {
        if (diffY > SWIPE_THRESHOLD && config.swipeActions.up) {
          execute(config.swipeActions.up);
          playSound('swish');
        } else if (diffY < -SWIPE_THRESHOLD && config.swipeActions.down) {
          execute(config.swipeActions.down);
          playSound('swish');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [execute, config]);

  return { commandPaletteOpen: commandPaletteOpenRef };
};

// SOUND FEEDBACK (game-like audio)
function playSound(type: 'click' | 'pop' | 'swish' | 'success' | 'error') {
  // Create on-the-fly sound using Web Audio API (no audio files needed)
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  const now = audioContext.currentTime;
  switch (type) {
    case 'click':
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    case 'pop':
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    case 'success':
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;
  }
}
