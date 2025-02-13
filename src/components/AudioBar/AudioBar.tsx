'use client';
import { FaCirclePause, FaCirclePlay, FaForwardStep, FaBackwardStep } from 'react-icons/fa6';
import { AudioBarProps } from './types';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const AudioBar = ({ audioSrc, thumbnail, title, artist, autoPlay = false }: AudioBarProps) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(barRef.current, { y: -200 });
    gsap.to(barRef.current, { y: 0, duration: 0.5, ease: 'back.out(1.7)' });
  }, [])

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset states when audio source changes
    setCurrentTime(0);
    setIsPlaying(false);

    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoPlay) {
        // Set volume to low before attempting to play
        audio.volume = 0.2;
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        console.log('LoadedMetadata duration:', audio.duration);
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        console.log('DurationChange duration:', audio.duration);
        setDuration(audio.duration);
      }
    };

    const handleCanPlayThrough = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        console.log('CanPlayThrough duration:', audio.duration);
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Add all event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.2;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.log('Playback failed:', error));
    }
  };

  return (
    <div
      ref={barRef}
      className="w-[380px] p-6 bg-[#182338] text-white rounded-lg shadow-lg">

      <div className='flex items-center justify-center'>
        <span className="font-montserrat font-bold text-lg">
          {title}
        </span>
      </div>

      <div className='flex items-center justify-center m-1 mb-2'>
        <span className="font-montserrat text-sm">
          {artist}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center pt-1">
        <div className="w-full h-1 bg-gray-600 rounded-full mb-6">
          <div
            className="h-full bg-white rounded-full transition-all duration-150"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>

        <div className='flex items-center justify-center gap-4'>
          <button className='w-10 h-10 rounded-full mr-2 flex items-center justify-center'>
            <FaBackwardStep size={25}/>
          </button>

          <button
            onClick={togglePlay}
            className='w-14 h-14 rounded-full flex items-center justify-center'>
          {isPlaying ?
                  <FaCirclePause size={45}/> :
                  <FaCirclePlay size={45}/>
          }
          </button>

          <button className='w-10 h-10 rounded-full ml-2 flex items-center justify-center'>
            <FaForwardStep size={25}/>
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onDurationChange={(e) => {
          const audio = e.currentTarget;
          if (audio.duration && !isNaN(audio.duration)) {
            console.log('Inline duration change:', audio.duration);
            setDuration(audio.duration);
          }
        }}
        className="hidden"/>
    </div>
  );
}