'use client';
import { ModalProps } from "./types";
import React, { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose, children }, ref) => {
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
        className="relative z-50"
        onClick={(e) => e.stopPropagation()}
        >
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';