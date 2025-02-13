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
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    if (!isMobile || isAnimating || !isDraggable) return;

    setIsAnimating(true);
    gsap.to(polaroidRef.current, {
      rotationY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        setIsFlipped(!isFlipped);
        setIsAnimating(false);
      }
    });
  };

  // Existing touch move handler
  const handleTouchMove = (e: TouchEvent) => {
    if (isDraggable && !isMobile) {
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

    if (isDraggable && !isMobile) {
      // Only initialize dragging on non-mobile devices
      dragInstance.current = Draggable.create(polaroidRef.current, {
        type: 'x',
        inertia: true,
        allowContextMenu: true,
        allowEventDefault: true, // Changed to true for Chrome
        dragClickables: true,
        dragResistance: 0.5,
        onDragStart: function() {
          setIsAnimating(true);
          // Don't modify body overflow here
        },
        onDrag: function() {
          if (isAnimating) return;

          const dragDistance = this.x;
          const baseRotation = isFlipped ? 180 : 0;
          const rotation = baseRotation + (dragDistance * 0.8);

          // Add bounds for rotation
          const boundedRotation = Math.max(0, Math.min(180, rotation));

          gsap.set(polaroidRef.current, {
            rotationY: boundedRotation,
            x: 0
          });
        },
        onDragEnd: function() {
          const dragDistance = this.x;
          const baseRotation = isFlipped ? 180 : 0;
          const rotation = baseRotation + (dragDistance * 0.8);

          // Reduced threshold for flipping on mobile
          if (rotation >= 30 && !isFlipped) { // Reduced from 40 to 30
            gsap.to(polaroidRef.current, {
              rotationY: 180,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                setIsFlipped(true);
                setIsAnimating(false);
                dragInstance.current?.enable();
              }
            });
          } else if (rotation <= 150 && isFlipped) { // Increased from 140 to 150
            gsap.to(polaroidRef.current, {
              rotationY: 0,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                setIsFlipped(false);
                setIsAnimating(false);
                dragInstance.current?.enable();
              }
            });
          } else {
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
  }, [isFlipped, isDraggable, resetFlip, isMobile]);

  // Add touch event handlers
  useEffect(() => {
    const element = polaroidRef.current;
    if (!element || !isDraggable) return;

    let startX = 0;
    let currentX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      currentX = startX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAnimating) {
        currentX = e.touches[0].clientX;
        const delta = currentX - startX;
        const baseRotation = isFlipped ? 180 : 0;
        const rotation = baseRotation + (delta * 0.8);

        if (rotation >= 0 && rotation <= 180) {
          gsap.set(element, {
            rotationY: rotation
          });
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDraggable, isAnimating, isFlipped]);

  return (
    <>
      <div
        ref={polaroidRef}
        id={id}
        onClick={handleClick}
        className={`polaroid bg-white p-4 w-[260px] pb-24 shadow-lg ${isAnimating ? 'pointer-events-none' : ''}
          ${isDraggable && isMobile ? 'cursor-pointer' : ''}`}
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
          <p className="text-center font-mono text-black text-xs">
          {caption?.split('\\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i !== caption?.split('\\n').length - 1 && <br />}
            </React.Fragment>
          ))}
          </p>
        </div>
      </div>
    </>
  );
};