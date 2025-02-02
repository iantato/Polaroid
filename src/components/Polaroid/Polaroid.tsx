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
  const [isFlipCooldown, setIsFlipCooldown] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalDrag = (e: PointerEvent) => {
      const rawDragDistance = e.clientX - dragStart;
      console.log('rawDragDistance', rawDragDistance);

      // Check if the user is dragging.
      if (Math.abs(rawDragDistance) > 5) {
        setHasDragged(true);
        console.log('hasDragged', hasDragged);
      }

      const rotation = dragStartRotation + (rawDragDistance * 0.5);

      gsap.set(cardRef.current, {
        rotationY: rotation,
      });
    }

    const handleGlobalDragEnd = (e: PointerEvent) => {
      setIsDragging(false);

      const rawDragDistance = e.clientX - dragStart;

      // Reset if not rotated enough.
      if (Math.abs(rawDragDistance) < 100 && hasDragged) {
        gsap.to(cardRef.current, {
          rotationY: dragStartRotation,
          duration: 0.2,
          ease: "power2.out"
        });
        return;
      } else if (Math.abs(rawDragDistance) > 100 && hasDragged) {
        const direction = rawDragDistance > 0 ? 1 : -1;
        const targetRotation = dragStartRotation + (180 * direction);

        gsap.to(cardRef.current, {
          rotationY: targetRotation,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            setIsFlipped(Math.abs(targetRotation % 360) === 180);
          }
        });
      }

      console.log('hasDragged', hasDragged);
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
    setDragStartRotation(currentRotation);
  }

  // const handleDragStart = (e: React.PointerEvent) => {
  //   setIsDragging(true);
  //   setHasDragged(false);
  //   setDragStart(e.clientX);
  //   // if (isFlipCooldown) return;
  //   // setIsDragging(true);
  //   // setHasDragged(false);
  //   // setDragStart(e.clientX);
  //   // // Store absolute rotation value
  //   // setDragStartRotation(isFlipped ? 180 : 0);
  // };

  // const handleDrag = (e: React.PointerEvent) => {
  //   if (!isDragging) return;

  //   const rawDragDistance = e.clientX - dragStart;
  //   if (Math.abs(rawDragDistance) > 5) {
  //     setHasDragged(true);
  //   }

  //   const newRotation = dragStartRotation + (rawDragDistance * 0.5);
  //   gsap.set(cardRef.current, {
  //     rotationY: newRotation,
  //   });
  // };

  // const handleDragEnd = (e: React.PointerEvent) => {
  //   if (!isDragging) return;

  //   setIsDragging(false);
  //   const rawDragDistance = e.clientX - dragStart;

  //   // Reset if not dragged enough.
  //   if (Math.abs(rawDragDistance) < 80) {
  //     gsap.to(cardRef.current, {
  //       rotationY: dragStartRotation,
  //       duration: 0.2,
  //       ease: "power2.out"
  //     });
  //     return;
  //   }

  //   const currentRotate = isFlipped ? -rawDragDistance : rawDragDistance;
  //   console.log('currentRotate', currentRotate);
  //   console.log('rawDragDistance', rawDragDistance);
  //   console.log('isFlipped', isFlipped);

  //   // if (Math.abs(currentRotate) > 100) {
  //   //   gsap.to(cardRef.current, {
  //   //     rotationY: isFlipped ? 180 : 0,
  //   //     duration: 0.4,
  //   //     ease: "power2.out",
  //   //     onComplete: () => {
  //   //       setIsFlipped(!isFlipped);
  //   //     }
  //   //   });
  //   // }


  //   // if (!isDragging || !hasDragged) {
  //   //   setIsDragging(false);
  //   //   return;
  //   // }

  //   // setIsDragging(false);
  //   // setIsFlipCooldown(true);

  //   // const rawDragDistance = e.clientX - dragStart;
  //   // const minMovement = 20;
  //   // const threshold = 90;

  //   // if (Math.abs(rawDragDistance) < minMovement) {
  //   //   gsap.to(cardRef.current, {
  //   //     rotationY: dragStartRotation,
  //   //     duration: 0.2,
  //   //     ease: "power2.out"
  //   //   });
  //   //   return;
  //   // }

  //   // // Direct rotation calculation
  //   // const direction = rawDragDistance > 0 ? 1 : -1;
  //   // const targetRotation = dragStartRotation + (180 * direction);

  //   // gsap.to(cardRef.current, {
  //   //   rotationY: targetRotation,
  //   //   duration: 0.4,
  //   //   ease: "power2.out",
  //   //   onComplete: () => {
  //   //     setIsFlipped(Math.abs(targetRotation % 360) === 180);
  //   //     setIsFlipCooldown(false);
  //   //   }
  //   // });
  // };

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