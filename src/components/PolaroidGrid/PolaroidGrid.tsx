'use client';
import { useRef, useState } from "react";
import { Modal } from "../Modal";
import { Polaroid } from "../Polaroid";
import { PolaroidProps } from "../Polaroid/types";
import { PolaroidGridProps } from "./types";
import gsap from 'gsap';

export function PolaroidGrid({ polaroids }: PolaroidGridProps) {

  const [selectedPolaroid, setSelectedPolaroid] = useState<PolaroidProps | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldResetFlip, setShouldResetFlip] = useState(false);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handlePolaroidClick = (polaroid: PolaroidProps, index: number) => {
    if (isAnimating) return;
    const gridItem = gridItemsRef.current[index]?.querySelector('.polaroid');

    if (gridItem && modalContentRef.current) {
      setIsAnimating(true);
      gridItem.setAttribute('data-index', index.toString());
      modalContentRef.current.appendChild(gridItem);

      gsap.to(gridItem, {
        scale: 1.5,
        zIndex: 50,
        duration: 0.3,
        ease: "back.out(1.7)",
        onComplete: () => {
          setIsAnimating(false);
        }
      });
    }

    setSelectedPolaroid(polaroid);
  };

  const handleModalClose = (gridItem: Element  | null | undefined) => {
    if (!gridItem || isAnimating) return;
    setIsAnimating(true);
    setShouldResetFlip(true);

    const index = Number(gridItem.getAttribute('data-index'));
    const originalParent = gridItemsRef.current[index];

    if (originalParent) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          setShouldResetFlip(false);
        }
      })

     tl.set(gridItem, {
        zIndex: 1000,
        position: 'relative'
      });

      originalParent.appendChild(gridItem);

      tl.to(gridItem, {
        rotationY: 0,
        duration: 0.3,
      })

      tl.to(gridItem, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(gridItem, {
            position: 'relative',
            zIndex: 1,
            duration: 0,
            clearProps: "transform, position",
          });
        }
      });
    }

    setSelectedPolaroid(null);
  }

  return (
    <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      {(polaroids || []).map((polaroid, index) => (
        <div
          key={polaroid.id}
          ref={el => { gridItemsRef.current[index] = el; }}
          onClick={() => handlePolaroidClick(polaroid, index)}
          className='cursor-pointer'>
          <Polaroid
            key={polaroid.id}
            id={polaroid.id}
            src={polaroid.src}
            alt={polaroid.alt}
            caption={polaroid.caption}
            isDraggable={selectedPolaroid?.id === polaroid.id}
            resetFlip={shouldResetFlip}
          />
        </div>
      ))}

      <Modal
        ref={modalContentRef}
        isOpen={selectedPolaroid !== null}
        onClose={() => {
          const gridItem = modalContentRef.current?.querySelector('.polaroid');
          handleModalClose(gridItem);
        }}>
      </Modal>
    </div>
  );
}