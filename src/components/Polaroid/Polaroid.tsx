'use client'
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

interface PolaroidProps {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export const Polaroid = ({ id, src, alt, caption }: PolaroidProps) => {

  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartRotation, setDragStartRotation] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalDrag = (e: PointerEvent) => {
      const rawDragDistance = e.clientX - dragStart;

      // Check if the user is dragging.
      if (Math.abs(rawDragDistance) > 5) {
        setHasDragged(true);
      }

      const rotation = currentRotation + (rawDragDistance * 0.5);
      console.log(rotation);

      gsap.set(cardRef.current, {
        rotationY: rotation,
      });
    }

    const handleGlobalDragEnd = (e: PointerEvent) => {
      setIsDragging(false);

      const rawDragDistance = e.clientX - dragStart;
      const currentAngle = currentRotation + (rawDragDistance * 0.5);

      // Normalize to closest multiple of 180
      const targetRotation = Math.round(currentAngle / 180) * 180;

      gsap.to(cardRef.current, {
        rotationY: targetRotation,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setCurrentRotation(((targetRotation % 360) + 360) % 360);
        }
      });
    }

    window.addEventListener('pointermove', handleGlobalDrag);
    window.addEventListener('pointerup', handleGlobalDragEnd);

    return () => {
      window.removeEventListener('pointermove', handleGlobalDrag);
      window.removeEventListener('pointerup', handleGlobalDragEnd);
    };

  }, [isDragging, hasDragged, dragStart, dragStartRotation])

  const handleDragStart = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasDragged(false);
    setDragStart(e.clientX);
  }

  return (
    <div ref={cardRef}
      onPointerDown={handleDragStart}
      className='polaroid bg-white p-4 pb-16 w-[300px] shadow-lg select-none touch-none cursor-grab active:cursor-grabbing'
      id={id}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="polaroid-front relative w-full aspect-square mb-6" style={{ backfaceVisibility: 'hidden' }}>
        <Image
            src={src}
            alt={alt}
            fill
            draggable={false}
            className="object-cover select-none"
            sizes='300px'
          />
      </div>
      <div
        className="absolute inset-0 bg-white p-4 flex items-center justify-center"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}
      >
        <p className="text-center font-mono text-black">{caption}</p>
      </div>
    </div>
  );
};