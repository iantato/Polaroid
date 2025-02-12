'use client'
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { PolaroidProps } from "./types";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { getNextFlightSegmentPath } from "next/dist/client/flight-data-helpers";

export const Polaroid = ({ id, src, alt, caption }: PolaroidProps) => {

  // const [dragStart, setDragStart] = useState(0);
  // const [isDragging, setIsDragging] = useState(false);
  // const [hasDragged, setHasDragged] = useState(false);
  // const [currentRotation, setCurrentRotation] = useState(0);

  // useEffect(() => {
  //   if (!isDragging) return;

  //   const handleGlobalDrag = (e: PointerEvent) => {
  //     const rawDragDistance = e.clientX - dragStart;

  //     // Check if the user is dragging.
  //     if (Math.abs(rawDragDistance) > 5) {
  //       setHasDragged(true);
  //     }

  //     const rotation = currentRotation + (rawDragDistance * 0.5);
  //     gsap.set(cardRef.current, {
  //       rotationY: rotation,
  //     });
  //   }

  //   const handleGlobalDragEnd = (e: PointerEvent) => {
  //     setIsDragging(false);

  //     const rawDragDistance = e.clientX - dragStart;
  //     const currentAngle = currentRotation + (rawDragDistance * 0.5);

  //     // Normalize to closest multiple of 180
  //     const targetRotation = Math.round(currentAngle / 180) * 180;

  //     gsap.to(cardRef.current, {
  //       rotationY: targetRotation,
  //       duration: 0.2,
  //       ease: "power2.out",
  //       onComplete: () => {
  //         setCurrentRotation(((targetRotation % 360) + 360) % 360);
  //       }
  //     });
  //   }

  //   window.addEventListener('pointermove', handleGlobalDrag);
  //   window.addEventListener('pointerup', handleGlobalDragEnd);

  //   return () => {
  //     window.removeEventListener('pointermove', handleGlobalDrag);
  //     window.removeEventListener('pointerup', handleGlobalDragEnd);
  //   };

  // }, [isDragging, hasDragged, dragStart])

  // const handleDragStart = (e: React.PointerEvent) => {
  //   setIsDragging(true);
  //   setHasDragged(false);
  //   setDragStart(e.clientX);
  // }

  gsap.registerPlugin(Draggable);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    Draggable.create(polaroidRef.current, {
      type: 'x',
      inertia: true,
      allowEventDefault: true,
      onDrag: function() {


        const dragDistance = this.x;
        const baseRotation = isFlipped ? 180 : 0;
        const rotation = baseRotation + (dragDistance * 0.8);
        console.log(rotation);

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
        const dragDistance = this.x;
        const baseRotation = isFlipped ? 180 : 0;
        const rotation = baseRotation + (dragDistance * 0.8);
        let targetRotation = 0

        if (rotation >= 80 && !isFlipped) {
          targetRotation = 180;

          gsap.to(polaroidRef.current, {
            rotationY: targetRotation,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              setIsFlipped(true);
            }
          });
        } else if (rotation <= 100 && isFlipped) {
          targetRotation = 0;

          gsap.to(polaroidRef.current, {
            rotationY: targetRotation,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              setIsFlipped(false);
            }
          });
        } else {
          gsap.to(polaroidRef.current, {
            rotationY: isFlipped ? 180 : 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }

        console.log(rotation);
        console.log(isFlipped);
        console.log('target', targetRotation);

      }
    })
  }, [isFlipped])

  return (
    <div
      ref={polaroidRef}
      className="polaroid bg-white p-4 w-[260px] pb-24 shadow-lg"
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
          className="object-cover select-none"
          sizes="500px"
        />
      </div>

      <div
        className="absolute inset-0 bg-white p-4 flex items-center justify-center"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden'
        }}>
        <p className="text-center font-mono text-black">{caption}</p>
      </div>
    </div>
  );
};