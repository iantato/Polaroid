'use client';
import { ModalProps } from "./types";
import React, { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose }, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        {opacity: 0},
        {opacity: 1, duration: 0.5})
    }
  }, [isOpen, ref]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{ display: isOpen ? 'flex' : 'none' }}>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>

      <div
        ref={ref}
        className="relative z-10"
        onClick={(e) => e.stopPropagation()}>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';