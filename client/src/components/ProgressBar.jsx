import { useRef, useState } from 'react';
import { formatTime } from '../utils/format.js';
import { usePlayer } from '../context/PlayerContext.jsx';

export function ProgressBar() {
  const { progress, duration, seek, audioRef } = usePlayer();
  const barRef = useRef(null);
  const dragging = useRef(false);
  const [hoverX, setHoverX] = useState(null);
  const [hoverTime, setHoverTime] = useState(0);

  const ratio = duration ? progress / duration : 0;

  function posFromEvent(e) {
    const rect = barRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const p = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return { p, x: clientX - rect.left, time: p * (audioRef.current?.duration || duration || 0) };
  }

  function start(e) {
    dragging.current = true;
    const { time, x, p } = posFromEvent(e);
    seek(time);
    setHoverX(x);
    setHoverTime(time);
    const move = (ev) => {
      const next = posFromEvent(ev);
      seek(next.time);
      setHoverX(next.x);
      setHoverTime(next.time);
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    void p;
  }

  return (
    <div className="flex w-full items-center gap-2 text-[11px] text-muted">
      <span className="w-10 text-right tabular-nums">{formatTime(progress)}</span>
      <div
        ref={barRef}
        className="group relative h-3 flex-1 cursor-pointer py-1"
        onMouseDown={start}
        onTouchStart={start}
        onMouseMove={(e) => {
          const { x, time } = posFromEvent(e);
          setHoverX(x);
          setHoverTime(time);
        }}
        onMouseLeave={() => !dragging.current && setHoverX(null)}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={progress}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') seek(progress + 5);
          if (e.key === 'ArrowLeft') seek(progress - 5);
        }}
      >
        <div className="absolute inset-y-[7px] left-0 right-0 rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white group-hover:bg-accent" style={{ width: `${ratio * 100}%` }} />
        </div>
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 group-hover:opacity-100"
          style={{ left: `calc(${ratio * 100}% - 6px)` }}
        />
        {hoverX != null && (
          <div
            className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded bg-raised px-1.5 py-0.5 text-[10px] text-white"
            style={{ left: hoverX }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
      <span className="w-10 tabular-nums">{formatTime(duration)}</span>
    </div>
  );
}
