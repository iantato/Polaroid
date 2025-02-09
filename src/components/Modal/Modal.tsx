'use client';
import { ModalProps } from "./types";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(bgRef.current, {
        duration: 0.3,
        autoAlpha: 1,
        ease: 'power2.inOut'
      });

      gsap.from(contentRef.current, {
        duration: 0.5,
        scale: 0.5,
        y: 100,
        autoAlpha: 1,
        ease: 'back.out(1.7)',
        delay: 0.1
      });
    }

    gsap.from(contentRef.current, {
      duration: 0.5,
      scale: 0.5,
      y: 100,
      autoAlpha: 0,
      ease: 'back.out(1.7)',
      delay: 0.1
    });
  }, [isOpen]);

  const handleClose = () => {
    // Animate out
    gsap.to(bgRef.current, {
      duration: 0.3,
      autoAlpha: 0,
      ease: 'power2.inOut'
    });

    gsap.to(contentRef.current, {
      duration: 0.3,
      scale: 0.5,
      y: 100,
      autoAlpha: 0,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref = {modalRef}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'
      onClick={onClose}>

      <div
        className='relative transform transition-all duration-300 scale-150'
        onClick={(e) => e.stopPropagation()}>
        <div className="rounded-lg p-4">
          {children}
        </div>
      </div>

    </div>
  );
}