import { useState } from 'react';

export default function useVisualMode(value) {
  const [mode, setMode] = useState(value);
  const [history, setHistory] = useState([]);

  function transition(valueTo, skipPrevious) {
    if (!skipPrevious) {
      setHistory(prev => [...prev, mode]);
    }
    setMode(valueTo);
  }

  function back() {
    if (history.length >= 1) {
      setMode(history[history.length - 1]);
      setHistory(prev => [...prev.slice(0, -1)]);
    }
  }

  return { transition, mode, back };
}
