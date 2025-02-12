'use client';
import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import { Polaroid } from "../Polaroid";
import { PolaroidProps } from "../Polaroid/types";
import { useSearchParams } from "next/navigation";
import gsap from 'gsap';

export function PolaroidGrid() {

  const [polaroids, setPolaroids] = useState<PolaroidProps[]>([]);
  const [selectedPolaroid, setSelectedPolaroid] = useState<PolaroidProps | null>(null);
  const [newPolaroid, setNewPolaroid] = useState<PolaroidProps | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldResetFlip, setShouldResetFlip] = useState(false);
  const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const newPolaroidAddedRef = useRef(false);

  const searchParams = useSearchParams();
  const newPolaroidId = searchParams.get('new');

  useEffect(() => {
    async function checkNewPolaroid() {
      if (!newPolaroidId || newPolaroidAddedRef.current) return;

      try {
        const response = await fetch(`/api/scan/${newPolaroidId}`);
        const data = await response.json();

        if (data.success) {
          const exists = polaroids.some(p => p.id == newPolaroidId);
          if (!exists) {
            setNewPolaroid(data.data);
            setPolaroids(prev => [...prev, data.data]);
            newPolaroidAddedRef.current = true;
          }
        }
      } catch (error) {
        console.error('Error checking new polaroid:', error);
      }
    }

    checkNewPolaroid();
  }, [newPolaroidId]);

  // useEffect(() => {
  //   const handleNewPolaroid = (polaroid: PolaroidProps) => {
  //     const gridItem = document.getElementById(polaroid.id);

  //     if (gridItem && newPolaroid) {
  //       setIsAnimating(true);

  //       gsap.set(gridItem, {
  //         scale: 1.5
  //       });

  //       const tl = gsap.timeline({
  //         onComplete: () => {
  //           setIsAnimating(false);
  //           setNewPolaroid(null);
  //           setPolaroids(prev => {
  //             const exists = prev.some(p => p.id === polaroid.id);
  //             if (!exists) {
  //               return [...prev, polaroid];
  //             }
  //             return prev;
  //           });
  //         }
  //       });

  //       tl.fromTo(
  //         gridItem.querySelector('.image-object'),
  //         {
  //           webkitFilter: "brightness(0.)",
  //           filter: "brightness(0)",
  //         },
  //         {
  //           webkitFilter: "brightness(1)",
  //           filter: "brightness(1)",
  //           duration: 0.3,
  //           delay: 1,
  //           ease: "power2.inOut"
  //         }
  //       );

  //       tl.to(gridItem, {
  //         scale: 1,
  //         duration: 0.3,
  //         ease: "power2.inOut",
  //         onComplete: () => {
  //           gsap.to(gridItem, {
  //             position: 'relative',
  //             zIndex: 1,
  //             duration: 0,
  //             clearProps: "transform, position",
  //           });
  //         }
  //       });

  //     }
  //   };

  //   const exists = polaroids.some(p => p.id == newPolaroidId);
  //   if (newPolaroid && !exists) {
  //     handleNewPolaroid(newPolaroid);
  //   }
  // }, [newPolaroid]);

  useEffect(() => {
    async function fetchPolaroids() {
      const response = await fetch('/api/polaroids')
      const data = await response.json();
      setPolaroids(data.data);
    }
    fetchPolaroids();
  }, [isAnimating])

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

  const handleNewPolaroidClose = () => {
    // if (newPolaroid) {
    //   setPolaroids(prev => [...prev, newPolaroid]);
    //   setNewPolaroid(null);
    // }
  };

  const handleModalClose = (gridItem: Element | null | undefined) => {
    if (!gridItem || isAnimating) return;
    setIsAnimating(true);
    setShouldResetFlip(true);

    const index = Number(gridItem.getAttribute('data-index'));
    const originalParent = gridItemsRef.current[index];

    const currentRotation = gsap.getProperty(gridItem, "rotationY") as number;
    const needsToFlip = currentRotation > 90;

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

      if (needsToFlip) {
        tl.to(gridItem, {
          rotationY: 0,
          duration: 0.3,
        })
      } else {
        tl.to(gridItem, {
          rotationY: 0,
          duration: 0.2
        })
      }

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
          if (newPolaroidId && selectedPolaroid?.id === newPolaroidId) {
            // Handle closing for new polaroid
            setPolaroids(prev => [...prev, selectedPolaroid]);
          }
          handleModalClose(gridItem);
        }}>
      </Modal>

      {/* <Modal
        isOpen={newPolaroid !== null}
        onClose={handleNewPolaroidClose}>
        {newPolaroid && (
        <Polaroid
          key={newPolaroid.id}
          id={newPolaroid.id}
          src={newPolaroid.src}
          alt={newPolaroid.alt}
          caption={newPolaroid.caption}
          isDraggable={false}
        />
      )}
      </Modal> */}
    </div>
  );
}