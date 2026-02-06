'use client';

import { useState, useRef } from 'react';
import type { MusicConfig } from '@/types';

interface MusicPlayerProps {
  config?: MusicConfig;
  className?: string;
}

/**
 * MusicPlayer - Componente para música de fondo
 * Single Price Model: Disponible para todos si está configurado.
 */
export function MusicPlayer({
  config,
  className = '',
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isEnabled = config?.enabled;

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Early return if not enabled
  if (!isEnabled) {
    return null;
  }

  const showSpotify = !!config.spotify_playlist_url;

  return (
    <div className={`music-player fixed bottom-4 right-4 z-40 ${className}`}>
      {/* Audio Element */}
      {config.track_url && (
        <audio
          ref={audioRef}
          src={config.track_url}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Minimized Button */}
      {!showPlayer ? (
        <button
          onClick={() => setShowPlayer(true)}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:scale-110 transition-transform"
          title="Mostrar reproductor"
        >
          <MusicIcon className="w-5 h-5" />
        </button>
      ) : (
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 text-white min-w-[200px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MusicIcon className="w-4 h-4 opacity-60" />
              <span className="text-xs opacity-60">Música</span>
            </div>
            <button
              onClick={() => setShowPlayer(false)}
              className="opacity-60 hover:opacity-100"
              title="Minimizar"
            >
              <MinimizeIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Track Info */}
          {config.track_name && (
            <div className="mb-3">
              <p className="text-sm font-medium truncate">{config.track_name}</p>
              {config.artist && (
                <p className="text-xs opacity-60 truncate">{config.artist}</p>
              )}
            </div>
          )}

          {/* Controls */}
          {config.track_url && (
            <button
              onClick={togglePlay}
              className="w-full py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-4 h-4" />
                  <span className="text-sm">Pausar</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  <span className="text-sm">Reproducir</span>
                </>
              )}
            </button>
          )}

          {/* Spotify Link */}
          {showSpotify && (
            <a
              href={config.spotify_playlist_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center text-xs text-green-400 hover:text-green-300"
            >
              🎵 Ver playlist en Spotify
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
