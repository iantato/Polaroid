'use client'
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { PolaroidProps } from "./types";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

export const Polaroid = ({ id, src, alt, caption, isDraggable = false, resetFlip = false }: PolaroidProps) => {
  gsap.registerPlugin(Draggable);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dragInstance = useRef<Draggable | null>(null);

  const handleTouchMove = (e: TouchEvent) => {
    if (isDraggable) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (isDraggable) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDraggable]);

  useEffect(() => {
    if (resetFlip && isFlipped) {
      setIsFlipped(false);
    }

    if (isDraggable) {
      dragInstance.current = Draggable.create(polaroidRef.current, {
        type: 'x',
        inertia: true,
        allowEventDefault: true,
        onDragStart: function() {
          document.body.style.overflow = 'hidden';
        },
        onDrag: function() {
          if (isAnimating) return;

          const dragDistance = this.x;
          const baseRotation = isFlipped ? 180 : 0;
          // Make rotation smoother by reducing the multiplier
          const rotation = baseRotation + (dragDistance * 0.5);

          if (rotation <= 0 || rotation >= 180) {
            gsap.set(polaroidRef.current, {
              x: 0
            })
            return;
          }

          gsap.set(polaroidRef.current, {
            rotationY: rotation,
            x: 0
          })
        },
        onDragEnd: function() {
          if (isAnimating) return;

          setIsAnimating(true);
          dragInstance.current?.disable();

          const dragDistance = this.x;
          const baseRotation = isFlipped ? 180 : 0;
          const rotation = baseRotation + (dragDistance * 0.5);
          let targetRotation = 0;

          // Smoother animation with better easing
          if (rotation >= 40 && !isFlipped) {
            targetRotation = 180;
            gsap.to(polaroidRef.current, {
              rotationY: targetRotation,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                setIsFlipped(true);
                setIsAnimating(false);
                dragInstance.current?.enable();
              }
            });
          } else if (rotation <= 140 && isFlipped) {
            targetRotation = 0;
            gsap.to(polaroidRef.current, {
              rotationY: targetRotation,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                setIsFlipped(false);
                setIsAnimating(false);
                dragInstance.current?.enable();
              }
            });
          } else {
            // Snap back animation
            gsap.to(polaroidRef.current, {
              rotationY: isFlipped ? 180 : 0,
              duration: 0.4,
              ease: "back.out(1.7)",
              onComplete: () => {
                setIsAnimating(false);
                dragInstance.current?.enable();
              }
            });
          }
        }
      })[0];
    }

    return () => {
      dragInstance.current?.kill();
    };
  }, [isFlipped, isDraggable, resetFlip]);

  return (
    <div
      ref={polaroidRef}
      id={id}
      className={`polaroid bg-white p-4 w-[260px] pb-24 shadow-lg ${isAnimating ? 'pointer-events-none' : ''}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        backfaceVisibility: 'hidden'
      }}>
      {/* Front side with image */}
      <div
        className="relative w-full aspect-square"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          draggable={false}
          className="image-object object-cover select-none"
          sizes="500px"
        />
      </div>

      <div
        className="absolute inset-0 bg-white p-4 flex items-center justify-center"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden'
        }}>
        <p className="text-center font-mono text-black text-xs">{caption}</p>
      </div>
    </div>
  );
};