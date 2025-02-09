'use client';
import { useRef, useState } from "react";
import { Modal } from "../Modal";
import { Polaroid } from "../Polaroid";
import { PolaroidProps } from "../Polaroid/types";
import { PolaroidGridProps } from "./types";
import gsap from 'gsap';

export function PolaroidGrid({ polaroids }: PolaroidGridProps) {
  const [selectedPolaroid, setSelectedPolaroid] = useState<PolaroidProps | null>(null);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([null]);

  const handlePolaroidClick = (polaroid: PolaroidProps, index: number) => {
    const gridItem = gridItemsRef.current[index];
    if (gridItem) {
      const rect = gridItem.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      setSelectedPolaroid(polaroid);

      // gridItemsRef.current.forEach((item, i) => {
      //   // Fade in background
      //   if (i == index && item) {
      //     gsap.to(item, {
      //       duration: 0.3,
      //       autoAlpha: 0,
      //       ease: 'power2.inOut'
      //     })
      //   }
      // });
    }
  }

  return (
    <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      {(polaroids || []).map((polaroid, index) => (
        <div
          key={polaroid.id}
          ref={el => { gridItemsRef.current[index] = el; }}
          onClick={() => handlePolaroidClick(polaroid, index)}
          className='cursor-pointer transform transition-all duration-300 hover:scale-105'>
          <Polaroid
            key={polaroid.id}
            id={polaroid.id}
            src={polaroid.src}
            alt={polaroid.alt}
            caption={polaroid.caption}
          />
        </div>
      ))}

      <Modal
        isOpen={selectedPolaroid !== null}
        onClose={() => setSelectedPolaroid(null)}>
          {selectedPolaroid && (
            <Polaroid
              id={selectedPolaroid.id}
              src={selectedPolaroid.src}
              alt={selectedPolaroid.alt}
              caption={selectedPolaroid.caption}
            />
          )}
      </Modal>
    </div>
  )

}