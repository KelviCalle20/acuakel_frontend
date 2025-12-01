import { useEffect, useRef } from "react";

interface AudioPlayerProps {
  audioUrl: string | null;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  if (!audioUrl) return null;

  return (
    <audio ref={audioRef} autoPlay loop>
      <source src={audioUrl} type="audio/mpeg" />
    </audio>
  );
}


