'use client';
import { useRef, useState } from "react";
import { Modal } from "../Modal";
import { Polaroid } from "../Polaroid";
import { PolaroidProps } from "../Polaroid/types";
import { PolaroidGridProps } from "./types";
import gsap from 'gsap';
import { Flip } from "gsap/dist/Flip";

export function PolaroidGrid({ polaroids }: PolaroidGridProps) {
  gsap.registerPlugin(Flip);

  const [selectedPolaroid, setSelectedPolaroid] = useState<PolaroidProps | null>(null);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handlePolaroidClick = (polaroid: PolaroidProps, index: number) => {
    const gridItem = gridItemsRef.current[index]?.querySelector('.polaroid');

    if (gridItem && modalContentRef.current) {

      gridItem.setAttribute('data-index', index.toString());

      const state = Flip.getState(gridItem);
      modalContentRef.current.appendChild(gridItem);

      Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        absolute: true,
        scale: true,
        absoluteOnLeave: true,
        zIndex: 1000,
        toggleClass: "flipping",
        onEnter: elements => {
          gsap.set(elements, {
            position: "absolute",
            left: "50%",
            top: "50%",
            xPercent: -50,
            yPercent: -50
          });
        },
        onComplete: () => {
          gsap.to(gridItem, {
            scale: 1.5,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        }
      });
    }

    setSelectedPolaroid(polaroid);
  };

  const handleModalClose = (gridItem: Element  | null | undefined) => {
    if (!gridItem) return;

    const state = Flip.getState(gridItem);

    const index = Number(gridItem.getAttribute('data-index'));
    const originalParent = gridItemsRef.current[index];

    if (originalParent) {
      // Move back to original container
      originalParent.appendChild(gridItem);

      // Animate back to grid position
      gsap.to(gridItem, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          // Move back to original container
          originalParent.appendChild(gridItem);
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