'use client';
import React, { forwardRef, useEffect, useRef } from 'react';
import { AudioBar } from "../AudioBar";
import { ModalProps } from "./types";
import gsap from 'gsap';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose, children, musicData }, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        {opacity: 0},
        {opacity: 1, duration: 0.5})
    }
  }, [isOpen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ display: isOpen ? 'flex' : 'none' }}>

      <div
        ref={overlayRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"/>

      <div
        ref={ref}
        className="relative z-50 flex flex-col items-center gap-6 transform"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {musicData?.audioSrc && (
          <div className="transform translate-y-[80px]">
            <AudioBar audioSrc={musicData.audioSrc} title={musicData.title} artist={musicData.artist} autoPlay={isOpen}/>
          </div>
        )}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';